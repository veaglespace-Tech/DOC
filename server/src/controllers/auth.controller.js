// src/modules/auth/auth.controller.js
const authService    = require('../services/auth.service');
const { sendSuccess, sendError } = require('../utils/response.util');

// ============================================================
// POST /api/v1/auth/register
// ============================================================
const register = async (req, res) => {
  const data   = req.body;
  const result = await authService.register(data);
  return sendSuccess(res, result, 'Registration successful', 201);
};

// ============================================================
// POST /api/v1/auth/login
// ============================================================
const login = async (req, res) => {
  const { email, phone, password } = req.body;
  const result = await authService.login({ email, phone, password });
  return sendSuccess(res, result, 'Login successful');
};

// ============================================================
// POST /api/v1/auth/refresh
// ============================================================
const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh(refreshToken);
  return sendSuccess(res, result, 'Tokens refreshed');
};

// ============================================================
// POST /api/v1/auth/logout
// ============================================================
const logout = async (req, res) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  return sendSuccess(res, null, 'Logged out successfully');
};

// ============================================================
// POST /api/v1/auth/send-otp
// ============================================================
const sendOtp = async (req, res) => {
  const { identifier, type } = req.body;
  const result = await authService.sendOtp({ identifier, type });
  return sendSuccess(res, result, 'OTP sent');
};

// ============================================================
// POST /api/v1/auth/verify-otp
// ============================================================
const verifyOtp = async (req, res) => {
  const { identifier, otp, type } = req.body;
  const result = await authService.verifyOtp({ identifier, otp, type });
  return sendSuccess(res, result, 'OTP verified');
};

// ============================================================
// GET /api/v1/auth/me  [Protected]
// ============================================================
const getMe = async (req, res) => {
  const result = await authService.getMe(req.user.id);
  return sendSuccess(res, result, 'User profile fetched');
};

// ============================================================
// PUT /api/v1/auth/change-password  [Protected]
// ============================================================
const changePassword = async (req, res) => {
  const result = await authService.changePassword(req.user.id, req.body);
  return sendSuccess(res, result, 'Password changed');
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
};
