// src/utils/otp.util.js
const crypto = require('crypto');

/**
 * Generate a numeric OTP of given length
 * @param {number} length - Default 6
 */
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  const bytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    otp += digits[bytes[i] % 10];
  }
  return otp;
};

/**
 * Get OTP expiry time
 * @param {number} minutes - Default 10
 */
const getOTPExpiry = (minutes = 10) => {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + minutes);
  return expiry;
};

module.exports = { generateOTP, getOTPExpiry };
