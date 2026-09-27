// src/utils/asyncHandler.util.js
/**
 * Wraps async route handlers to automatically catch errors
 * and forward them to Express global error handler.
 * Eliminates the need for try-catch in every controller.
 *
 * Usage:
 *   const getProfile = asyncHandler(async (req, res) => {
 *     const data = await someService.getProfile(req.user.id);
 *     sendSuccess(res, data, 'Profile fetched');
 *   });
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
