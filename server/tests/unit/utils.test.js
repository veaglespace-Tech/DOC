const { calculateDistance } = require('../../src/utils/distance.util');
const { hashPassword, comparePassword } = require('../../src/utils/hash.util');
const { signAccessToken, verifyAccessToken } = require('../../src/utils/jwt.util');
const { generateOTP, getOTPExpiry } = require('../../src/utils/otp.util');

describe('CareConnect Core Utilities Test Suite', () => {
  
  describe('Haversine Distance Calculator', () => {
    it('should return 0 distance for identical coordinates', () => {
      const dist = calculateDistance(18.5204, 73.8567, 18.5204, 73.8567);
      expect(dist).toBeCloseTo(0, 4);
    });

    it('should accurately calculate distance between Pune and Mumbai (~120-130 km)', () => {
      const puneLat = 18.5204, puneLng = 73.8567;
      const mumbaiLat = 19.0760, mumbaiLng = 72.8777;
      const dist = calculateDistance(puneLat, puneLng, mumbaiLat, mumbaiLng);
      expect(dist).toBeGreaterThan(115);
      expect(dist).toBeLessThan(135);
    });

    it('should accurately filter within 5km emergency doctor radius', () => {
      // Patient at Swargate, Pune (18.5018, 73.8587)
      // Doctor at Deccan Gymkhana, Pune (18.5167, 73.8417) (~2.5 km)
      const patientLat = 18.5018, patientLng = 73.8587;
      const doctorLat = 18.5167, doctorLng = 73.8417;
      const dist = calculateDistance(patientLat, patientLng, doctorLat, doctorLng);
      expect(dist).toBeLessThan(5);
    });
  });

  describe('Password Hashing & Validation (Bcrypt)', () => {
    it('should generate secure hashed password and verify matching plain text', async () => {
      const password = 'DoctorSecret@2026';
      const hash = await hashPassword(password);
      
      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      
      const isMatch = await comparePassword(password, hash);
      expect(isMatch).toBe(true);

      const isWrong = await comparePassword('WrongPassword123', hash);
      expect(isWrong).toBe(false);
    });
  });

  describe('JWT Access Token Signing & Verification', () => {
    beforeAll(() => {
      process.env.JWT_ACCESS_SECRET = 'test_access_secret_key_123456';
      process.env.JWT_ACCESS_EXPIRES_IN = '15m';
    });

    it('should sign JWT payload and decode verified claims', () => {
      const payload = { userId: 42, role: 'DOCTOR', email: 'dr.sharma@careconnect.in' };
      const token = signAccessToken(payload);
      expect(token).toBeDefined();

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(42);
      expect(decoded.role).toBe('DOCTOR');
      expect(decoded.email).toBe('dr.sharma@careconnect.in');
    });
  });

  describe('OTP Generation & Expiry', () => {
    it('should generate numeric OTP with exact 6 digits', () => {
      const otp = generateOTP(6);
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should compute valid future expiry timestamp (default 10 mins)', () => {
      const now = new Date();
      const expiry = getOTPExpiry(10);
      const diffMs = expiry.getTime() - now.getTime();
      const diffMinutes = Math.round(diffMs / (60 * 1000));
      expect(diffMinutes).toBe(10);
    });
  });

});
