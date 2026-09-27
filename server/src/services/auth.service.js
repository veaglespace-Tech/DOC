const prisma        = require('../config/database');
const logger        = require('../config/logger');
const { hashPassword, comparePassword } = require('../utils/hash.util');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');
const { generateOTP, getOTPExpiry }    = require('../utils/otp.util');
const { generateAndSendOtp: dispatchOtp, verifyOtp: confirmOtp } = require('./otp.service');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// HELPERS
// ============================================================

/**
 * Build JWT payload from user record + roles + permissions
 */
const buildTokenPayload = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              rolePerms: { include: { permission: true } },
            },
          },
        },
      },
      patient: { select: { id: true } },
      doctor:  { select: { id: true, verificationStatus: true } },
    },
  });

  if (!user) throw new Error('User not found');

  const roles = user.userRoles.map((ur) => ur.role.name);
  const permissions = [
    ...new Set(
      user.userRoles.flatMap((ur) =>
        ur.role.rolePerms.map((rp) => rp.permission.name)
      )
    ),
  ];

  return {
    id:          user.id,
    uuid:        user.uuid,
    email:       user.email,
    phone:       user.phone,
    roles,
    permissions,
    patientId:   user.patient?.id || null,
    doctorId:    user.doctor?.id  || null,
  };
};

/**
 * Issue access + refresh token pair and persist refresh token in DB
 */
const issueTokenPair = async (userId) => {
  const payload      = await buildTokenPayload(userId);
  const accessToken  = signAccessToken(payload);
  const refreshToken = signRefreshToken({ id: userId });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId, expiresAt },
  });

  return { accessToken, refreshToken, user: payload };
};

// ============================================================
// REGISTER
// ============================================================

const register = async ({ name, email, phone, password, role, organizationId }) => {
  // Check duplicate
  if (email) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
  }
  if (phone) {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) throw Object.assign(new Error('Phone already registered'), { statusCode: 409 });
  }

  const passwordHash = await hashPassword(password);

  // Create user + role + profile in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create user
    const user = await tx.user.create({
      data: {
        uuid: uuidv4(),
        email:        email  || null,
        phone:        phone  || null,
        passwordHash,
        isActive:     true,
        isVerified:   false,
      },
    });

    // 2. Assign role
    const roleRecord = await tx.role.findUnique({ where: { name: role } });
    if (!roleRecord) throw new Error(`Role ${role} not found`);

    await tx.userRole.create({ data: { userId: user.id, roleId: roleRecord.id } });

    // 3. Create profile based on role
    if (role === 'PATIENT') {
      await tx.patient.create({
        data: {
          userId:         user.id,
          name,
          organizationId: organizationId || null,
        },
      });
    } else if (role === 'DOCTOR') {
      const doctor = await tx.doctor.create({
        data: {
          userId:             user.id,
          name,
          verificationStatus: 'PENDING',
          organizationId:     organizationId || null,
        },
        select: { id: true },
      });
      // Create wallet for doctor immediately on registration
      await tx.doctorWallet.create({ data: { doctorId: doctor.id } });
    }

    return user;
  });

  logger.info(`Auth: Registered ${role} user id=${result.id}`);
  return { userId: result.id, message: 'Registration successful. Please verify your account.' };
};

// ============================================================
// LOGIN
// ============================================================

const login = async ({ email, phone, password }) => {
  const where = email ? { email } : { phone };
  const user  = await prisma.user.findUnique({
    where,
    include: { userRoles: { include: { role: true } } },
  });

  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  if (!user.isActive) {
    throw Object.assign(new Error('Account has been suspended. Contact support.'), { statusCode: 403 });
  }

  const isMatch = await comparePassword(password, user.passwordHash);
  if (!isMatch) {
    throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 });
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data:  { lastLoginAt: new Date() },
  });

  const tokens = await issueTokenPair(user.id);
  logger.info(`Auth: User id=${user.id} logged in`);
  return tokens;
};

// ============================================================
// REFRESH TOKEN
// ============================================================

const refresh = async (refreshToken) => {
  // 1. Verify JWT signature
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }

  // 2. Check DB — must exist and not be revoked
  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.isRevoked || new Date() > stored.expiresAt) {
    throw Object.assign(new Error('Refresh token is invalid or expired'), { statusCode: 401 });
  }

  // 3. Revoke old token (rotation)
  await prisma.refreshToken.update({ where: { id: stored.id }, data: { isRevoked: true } });

  // 4. Issue new pair
  const tokens = await issueTokenPair(decoded.id);
  logger.info(`Auth: Refreshed tokens for user id=${decoded.id}`);
  return tokens;
};

// ============================================================
// LOGOUT
// ============================================================

const logout = async (refreshToken) => {
  if (!refreshToken) return;

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, isRevoked: false },
    data:  { isRevoked: true },
  });
  logger.info('Auth: Logout — refresh token revoked');
};

// ============================================================
// OTP — SEND
// ============================================================

const sendOtp = async ({ identifier, type }) => {
  const isEmail = identifier.includes('@');
  const where   = isEmail ? { email: identifier } : { phone: identifier };

  const user = await prisma.user.findUnique({
    where,
    include: { patient: { select: { name: true } }, doctor: { select: { name: true } } },
  });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const userName = user.patient?.name || user.doctor?.name || 'User';

  // Dispatch via real OTP microservice (Twilio SMS / Nodemailer)
  const result = await dispatchOtp({ userId: user.id, identifier, type, userName });

  return { message: 'OTP sent successfully', expiresIn: result.expiresIn, ...result };
};

// ============================================================
// OTP — VERIFY
// ============================================================

const verifyOtp = async ({ identifier, otp, type }) => {
  const isEmail = identifier.includes('@');
  const where   = isEmail ? { email: identifier } : { phone: identifier };
  const user    = await prisma.user.findUnique({ where });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  // Delegate to otp.service for verification
  const result = await confirmOtp({ userId: user.id, otp, type });

  logger.info(`Auth: OTP verified for user id=${user.id} type=${type}`);
  return { message: 'OTP verified successfully', userId: user.id, verified: result.verified };
};

// ============================================================
// GET ME (Current user)
// ============================================================

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id:         true,
      uuid:       true,
      email:      true,
      phone:      true,
      isVerified: true,
      isActive:   true,
      lastLoginAt:true,
      createdAt:  true,
      userRoles: {
        include: { role: { select: { name: true } } },
      },
      patient: {
        select: {
          id: true, name: true, gender: true,
          bloodGroup: true, city: true,
        },
      },
      doctor: {
        select: {
          id: true, name: true, verificationStatus: true,
          isOnline: true, isAvailable: true,
          rating: true, totalReviews: true,
        },
      },
    },
  });

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 });

  return {
    ...user,
    roles: user.userRoles.map((ur) => ur.role.name),
    userRoles: undefined,
  };
};

// ============================================================
// CHANGE PASSWORD
// ============================================================

const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.passwordHash) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const isMatch = await comparePassword(currentPassword, user.passwordHash);
  if (!isMatch) {
    throw Object.assign(new Error('Current password is incorrect'), { statusCode: 400 });
  }

  const newHash = await hashPassword(newPassword);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: newHash } });

  // Revoke all refresh tokens (force re-login everywhere)
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data:  { isRevoked: true },
  });

  logger.info(`Auth: Password changed for user id=${userId}`);
  return { message: 'Password changed successfully. Please login again.' };
};

// ============================================================
// REVOKE ALL SESSIONS (Admin use)
// ============================================================

const revokeAllSessions = async (userId) => {
  await prisma.refreshToken.updateMany({
    where: { userId, isRevoked: false },
    data:  { isRevoked: true },
  });
  logger.info(`Auth: All sessions revoked for user id=${userId}`);
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  sendOtp,
  verifyOtp,
  getMe,
  changePassword,
  revokeAllSessions,
};
