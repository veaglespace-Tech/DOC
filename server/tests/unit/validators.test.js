const {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  startVisitSchema,
  completeVisitSchema
} = require('../../src/validators/appointment.validator');

const {
  registerSchema,
  loginSchema,
  verifyOtpSchema
} = require('../../src/validators/auth.validator');

describe('CareConnect Zod Validators Test Suite', () => {

  describe('Appointment Validators', () => {
    it('should validate valid appointment booking payload', () => {
      const payload = {
        doctorId: 12,
        serviceType: 'NORMAL',
        scheduledAt: new Date(Date.now() + 86400000).toISOString(),
        notes: 'Mild fever and cough since 2 days'
      };

      const result = createAppointmentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it('should reject booking without doctorId or scheduledAt', () => {
      const invalidPayload = {
        notes: 'Missing doctor and date'
      };

      const result = createAppointmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      expect(result.error.issues.length).toBeGreaterThanOrEqual(1);
    });

    it('should accept valid BRD appointment lifecycle status transitions', () => {
      const validStatuses = [
        'REQUESTED',
        'PAYMENT_PENDING',
        'PAID',
        'DOCTOR_ACCEPTED',
        'ON_THE_WAY',
        'ARRIVED',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
      ];

      validStatuses.forEach((status) => {
        const result = updateAppointmentStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status string', () => {
      const result = updateAppointmentStatusSchema.safeParse({ status: 'INVALID_STATUS' });
      expect(result.success).toBe(false);
    });
  });

  describe('Authentication Validators', () => {
    it('should validate registration with valid email, password, and role', () => {
      const patientReg = {
        name: 'Arjun Deshmukh',
        email: 'arjun@careconnect.in',
        password: 'Password@2026',
        role: 'PATIENT'
      };

      const result = registerSchema.safeParse(patientReg);
      expect(result.success).toBe(true);
    });

    it('should reject registration if password is less than 8 characters', () => {
      const shortPw = {
        name: 'Arjun Deshmukh',
        email: 'arjun@careconnect.in',
        password: '123',
        role: 'PATIENT'
      };

      const result = registerSchema.safeParse(shortPw);
      expect(result.success).toBe(false);
    });

    it('should validate 6-digit OTP verification payload', () => {
      const validOtp = {
        identifier: 'arjun@careconnect.in',
        otp: '492810',
        type: 'EMAIL_VERIFY'
      };

      const result = verifyOtpSchema.safeParse(validOtp);
      expect(result.success).toBe(true);

      const invalidOtp = {
        identifier: 'arjun@careconnect.in',
        otp: '123', // only 3 digits
        type: 'EMAIL_VERIFY'
      };
      const invalidResult = verifyOtpSchema.safeParse(invalidOtp);
      expect(invalidResult.success).toBe(false);
    });
  });

});
