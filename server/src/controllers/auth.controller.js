// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response.util');
const asyncHandler = require('../utils/asyncHandler.util');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body, req.tenant);
  return sendSuccess(res, result, 'Registration successful. Please verify your email.', 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req.tenant);
  return sendSuccess(res, result, 'Login successful');
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  return sendSuccess(res, null, 'Logged out successfully');
});

const refresh = asyncHandler(async (req, res) => {
  const result = await authService.refresh(req.body.refreshToken);
  return sendSuccess(res, result, 'Token refreshed');
});

const sendOtp = asyncHandler(async (req, res) => {
  await authService.sendOtp(req.body, req.tenant);
  return sendSuccess(res, null, 'OTP sent successfully');
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);
  return sendSuccess(res, result, 'OTP verified successfully');
});

const getMe = asyncHandler(async (req, res) => {
  const result = await authService.getMe(req.user.id);
  return sendSuccess(res, result, 'User profile fetched');
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);
  return sendSuccess(res, null, 'Password changed successfully');
});

module.exports = { register, login, logout, refresh, sendOtp, verifyOtp, getMe, changePassword };
