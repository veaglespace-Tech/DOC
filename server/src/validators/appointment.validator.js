const { z } = require('zod');

const createAppointmentSchema = z.object({
  doctorId: z.number().int().positive("Valid Doctor ID is required"),
  serviceType: z.enum(["NORMAL", "HOME_VISIT", "EMERGENCY"]).default("NORMAL"),
  scheduledAt: z.string().datetime("Valid scheduled date-time is required"),
  notes: z.string().max(1000, "Notes too long").optional(),
});

const updateAppointmentStatusSchema = z.object({
  status: z.enum([
    "REQUESTED", 
    "PAYMENT_PENDING", 
    "PAID", 
    "DOCTOR_ACCEPTED", 
    "ON_THE_WAY", 
    "ARRIVED", 
    "IN_PROGRESS", 
    "COMPLETED", 
    "CANCELLED"
  ]),
  cancelReason: z.string().max(1000).optional()
});

const startVisitSchema = z.object({
  doctorLatitude: z.number().optional(),
  doctorLongitude: z.number().optional(),
});

const completeVisitSchema = z.object({
  doctorNotes: z.string().max(2000, "Notes too long").optional(),
  followUpDate: z.string().datetime().optional()
});

module.exports = {
  createAppointmentSchema,
  updateAppointmentStatusSchema,
  startVisitSchema,
  completeVisitSchema
};
