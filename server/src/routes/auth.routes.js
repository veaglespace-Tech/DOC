// src/modules/auth/auth.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const { validate }         = require('../middlewares/validate.middleware');
const { authenticate }     = require('../middlewares/auth.middleware');
const { authLimiter, otpLimiter } = require('../middlewares/rateLimit.middleware');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  sendOtpSchema,
  verifyOtpSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & Authorization endpoints
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new Patient or Doctor
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, password, role]
 *             properties:
 *               name:           { type: string, example: "Raj Patil" }
 *               email:          { type: string, example: "raj@email.com" }
 *               phone:          { type: string, example: "+919876543210" }
 *               password:       { type: string, minLength: 8 }
 *               role:           { type: string, enum: [PATIENT, DOCTOR] }
 *               organizationId: { type: integer }
 *     responses:
 *       201: { description: Registered successfully }
 *       409: { description: Email or phone already exists }
 *       422: { description: Validation error }
 */
router.post(
  '/register',
  authLimiter,
  validate(registerSchema),
  controller.register,
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with email/phone + password
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               email:    { type: string }
 *               phone:    { type: string }
 *               password: { type: string }
 *     responses:
 *       200: { description: Login successful, returns accessToken + refreshToken }
 *       401: { description: Invalid credentials }
 *       403: { description: Account suspended }
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema),
  controller.login,
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: New token pair issued }
 *       401: { description: Invalid or expired refresh token }
 */
router.post(
  '/refresh',
  validate(refreshSchema),
  controller.refresh,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout and revoke refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken: { type: string }
 *     responses:
 *       200: { description: Logged out successfully }
 */
router.post(
  '/logout',
  controller.logout,
);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP for email/phone verification
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, type]
 *             properties:
 *               identifier: { type: string, description: "Email or phone number" }
 *               type:       { type: string, enum: [EMAIL_VERIFY, PHONE_VERIFY, LOGIN, PASSWORD_RESET] }
 *     responses:
 *       200: { description: OTP sent }
 *       404: { description: User not found }
 */
router.post(
  '/send-otp',
  otpLimiter,
  validate(sendOtpSchema),
  controller.sendOtp,
);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, otp, type]
 *             properties:
 *               identifier: { type: string }
 *               otp:        { type: string, minLength: 6, maxLength: 6 }
 *               type:       { type: string, enum: [EMAIL_VERIFY, PHONE_VERIFY, LOGIN, PASSWORD_RESET] }
 *     responses:
 *       200: { description: OTP verified }
 *       400: { description: Invalid or expired OTP }
 */
router.post(
  '/verify-otp',
  otpLimiter,
  validate(verifyOtpSchema),
  controller.verifyOtp,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user profile
 *     tags: [Auth]
 *     responses:
 *       200: { description: User profile }
 *       401: { description: Unauthorized }
 */
router.get(
  '/me',
  authenticate,
  controller.getMe,
);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Change password (requires authentication)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [currentPassword, newPassword]
 *             properties:
 *               currentPassword: { type: string }
 *               newPassword:     { type: string, minLength: 8 }
 *     responses:
 *       200: { description: Password changed }
 *       400: { description: Current password incorrect }
 */
router.put(
  '/change-password',
  authenticate,
  validate(changePasswordSchema),
  controller.changePassword,
);

module.exports = router;
