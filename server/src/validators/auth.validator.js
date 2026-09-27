// src/modules/auth/auth.validator.js
const { z } = require('zod');

const registerSchema = z.object({
  name:             z.string().min(2).max(100),
  email:            z.string().email().optional(),
  phone:            z.string().regex(/^\+?[1-9]\d{9,14}$/, 'Invalid phone number').optional(),
  password:         z.string().min(8, 'Password must be at least 8 characters'),
  role:             z.enum(['PATIENT', 'DOCTOR']),
  organizationId:   z.number().int().positive().optional(),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
});

const loginSchema = z.object({
  email:    z.string().email().optional(),
  phone:    z.string().optional(),
  password: z.string().min(1, 'Password is required'),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone is required',
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1),
});

const sendOtpSchema = z.object({
  identifier: z.string().min(1), // email or phone
  type:       z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY', 'LOGIN', 'PASSWORD_RESET']),
});

const verifyOtpSchema = z.object({
  identifier: z.string().min(1),
  otp:        z.string().length(6),
  type:       z.enum(['EMAIL_VERIFY', 'PHONE_VERIFY', 'LOGIN', 'PASSWORD_RESET']),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshSchema,
  sendOtpSchema,
  verifyOtpSchema,
  changePasswordSchema,
};
