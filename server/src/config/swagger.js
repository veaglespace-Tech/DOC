// src/config/swagger.js
/**
 * Swagger / OpenAPI 3.0 Configuration
 * BRD Tech Stack: Swagger / OpenAPI
 *
 * Docs available at: GET /api/docs
 * Raw JSON spec at:  GET /api/docs/swagger.json
 */
const swaggerJsdoc = require('swagger-jsdoc');

// ============================================================
// Reusable schema components
// ============================================================
const components = {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter your JWT access token. Obtain it from POST /auth/login',
    },
  },
  schemas: {
    // ---- Standard Responses ----
    SuccessResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Operation successful' },
        data:    { type: 'object', nullable: true },
      },
    },
    ErrorResponse: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        message: { type: 'string', example: 'Something went wrong' },
        errors:  {
          type: 'array',
          nullable: true,
          items: {
            type: 'object',
            properties: {
              field:   { type: 'string' },
              message: { type: 'string' },
            },
          },
        },
      },
    },
    PaginationMeta: {
      type: 'object',
      properties: {
        total:      { type: 'integer', example: 100 },
        page:       { type: 'integer', example: 1 },
        limit:      { type: 'integer', example: 10 },
        totalPages: { type: 'integer', example: 10 },
        hasNext:    { type: 'boolean', example: true },
        hasPrev:    { type: 'boolean', example: false },
      },
    },

    // ---- Auth Schemas ----
    RegisterRequest: {
      type: 'object',
      required: ['name', 'password', 'role'],
      properties: {
        name:           { type: 'string', example: 'Raj Patil' },
        email:          { type: 'string', format: 'email', example: 'raj@email.com' },
        phone:          { type: 'string', example: '+919876543210' },
        password:       { type: 'string', minLength: 8, example: 'SecurePass@123' },
        role:           { type: 'string', enum: ['PATIENT', 'DOCTOR'] },
        organizationId: { type: 'integer', nullable: true, example: 1 },
      },
    },
    LoginRequest: {
      type: 'object',
      required: ['password'],
      properties: {
        email:    { type: 'string', format: 'email', example: 'raj@email.com' },
        phone:    { type: 'string', example: '+919876543210' },
        password: { type: 'string', example: 'SecurePass@123' },
      },
    },
    TokenPair: {
      type: 'object',
      properties: {
        accessToken:  { type: 'string', description: 'JWT access token (15m expiry)' },
        refreshToken: { type: 'string', description: 'JWT refresh token (7d expiry)' },
        user: {
          type: 'object',
          properties: {
            id:          { type: 'integer' },
            uuid:        { type: 'string' },
            email:       { type: 'string', nullable: true },
            phone:       { type: 'string', nullable: true },
            roles:       { type: 'array', items: { type: 'string' } },
            permissions: { type: 'array', items: { type: 'string' } },
            patientId:   { type: 'integer', nullable: true },
            doctorId:    { type: 'integer', nullable: true },
          },
        },
      },
    },
    OtpRequest: {
      type: 'object',
      required: ['identifier', 'type'],
      properties: {
        identifier: { type: 'string', example: 'raj@email.com', description: 'Email or phone number' },
        type: {
          type: 'string',
          enum: ['EMAIL_VERIFY', 'PHONE_VERIFY', 'LOGIN', 'PASSWORD_RESET'],
        },
      },
    },
    OtpVerifyRequest: {
      type: 'object',
      required: ['identifier', 'otp', 'type'],
      properties: {
        identifier: { type: 'string', example: 'raj@email.com' },
        otp:        { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
        type: {
          type: 'string',
          enum: ['EMAIL_VERIFY', 'PHONE_VERIFY', 'LOGIN', 'PASSWORD_RESET'],
        },
      },
    },

    // ---- User Profile ----
    UserProfile: {
      type: 'object',
      properties: {
        id:          { type: 'integer', example: 1 },
        uuid:        { type: 'string', example: 'a1b2c3-...' },
        email:       { type: 'string', nullable: true },
        phone:       { type: 'string', nullable: true },
        isVerified:  { type: 'boolean' },
        isActive:    { type: 'boolean' },
        lastLoginAt: { type: 'string', format: 'date-time', nullable: true },
        roles:       { type: 'array', items: { type: 'string' } },
        patient:     { type: 'object', nullable: true },
        doctor:      { type: 'object', nullable: true },
      },
    },

    // ---- Doctor Schemas ----
    DoctorCard: {
      type: 'object',
      description: 'Doctor search result card — as per BRD Section 4',
      properties: {
        id:                   { type: 'integer' },
        name:                 { type: 'string', example: 'Dr. Ramesh Sharma' },
        specializations:      { type: 'array', items: { type: 'string' } },
        experienceYears:      { type: 'integer', example: 15 },
        distanceKm:           { type: 'number', format: 'float', example: 2.4 },
        consultationFee:      { type: 'number', example: 1500 },
        rating:               { type: 'number', example: 4.8 },
        totalReviews:         { type: 'integer', example: 124 },
        isAvailable:          { type: 'boolean' },
        isEmergencyAvailable: { type: 'boolean' },
        verificationStatus:   { type: 'string', enum: ['PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'] },
        profileImage:         { type: 'string', nullable: true },
      },
    },

    // ---- Appointment Schemas ----
    AppointmentStatus: {
      type: 'string',
      enum: [
        'REQUESTED', 'PAYMENT_PENDING', 'PAID', 'DOCTOR_ASSIGNED',
        'DOCTOR_ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS',
        'COMPLETED', 'CANCELLED', 'REFUND',
      ],
      description: 'Visit lifecycle status — BRD Section 8',
    },

    // ---- Payment Schemas ----
    PaymentStatus: {
      type: 'string',
      enum: ['INITIATED', 'PENDING', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      description: 'Payment status — BRD Section 10',
    },

    // ---- Emergency Schemas ----
    EmergencyRequest: {
      type: 'object',
      required: ['latitude', 'longitude'],
      properties: {
        latitude:     { type: 'number', format: 'float', example: 18.5204 },
        longitude:    { type: 'number', format: 'float', example: 73.8567 },
        medicalNeeds: { type: 'string', example: 'Chest pain, difficulty breathing' },
      },
    },
  },

  // ---- Reusable Parameters ----
  parameters: {
    PageParam: {
      in: 'query', name: 'page', schema: { type: 'integer', default: 1 },
      description: 'Page number (1-indexed)',
    },
    LimitParam: {
      in: 'query', name: 'limit', schema: { type: 'integer', default: 10, maximum: 100 },
      description: 'Items per page (max 100)',
    },
    IdParam: {
      in: 'path', name: 'id', required: true, schema: { type: 'integer' },
      description: 'Resource ID',
    },
  },

  // ---- Reusable Responses ----
  responses: {
    Unauthorized: {
      description: 'Unauthorized — JWT token missing or invalid',
      content: {
        'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
      },
    },
    Forbidden: {
      description: 'Forbidden — Insufficient role or permission',
      content: {
        'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
      },
    },
    NotFound: {
      description: 'Resource not found',
      content: {
        'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
      },
    },
    ValidationError: {
      description: 'Validation error — invalid request body',
      content: {
        'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
      },
    },
    ServerError: {
      description: 'Internal server error',
      content: {
        'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } },
      },
    },
  },
};

// ============================================================
// Swagger JSDoc options
// ============================================================
const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'CareConnect API',
      version: '1.0.0',
      description: `
## CareConnect — Doctor-on-Demand & Healthcare SaaS Platform API

**Platform Roles:**
- 🧑‍⚕️ **Patient** — Book appointments, emergency requests, payments, medical records
- 👨‍⚕️ **Doctor** — Manage availability, appointments, earnings, KYC
- 🏥 **Clinic Admin** — Manage staff, doctors, clinic operations
- 🛡️ **Super Admin** — Full platform control
- 📞 **Support** — Emergency & operational management
- 💰 **Finance Admin** — Payments, settlements, withdrawals

**Authentication:**
All protected endpoints require a \`Bearer\` JWT token.
Obtain tokens from \`POST /auth/login\` or \`POST /auth/refresh\`.

**Multi-Tenant:**
Pass \`X-Tenant-ID: {subdomain}\` header for organization-specific context.

**API Versioning:** All endpoints are prefixed with \`/api/v1/\`
      `,
      contact: {
        name: 'CareConnect Dev Team',
        email: 'dev@careconnect.in',
      },
      license: {
        name: 'Proprietary',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: '🚀 Development Server',
      },
      {
        url: 'https://api.careconnect.in/api/v1',
        description: '🌐 Production Server',
      },
    ],
    components,
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth',          description: '🔐 Authentication & Token Management' },
      { name: 'Patients',      description: '🧑‍⚕️ Patient Profile & Medical History' },
      { name: 'Doctors',       description: '👨‍⚕️ Doctor Profile, KYC & Availability' },
      { name: 'Appointments',  description: '📅 Appointment Booking & Management' },
      { name: 'Emergency',     description: '🚨 Emergency Doctor Dispatch' },
      { name: 'Payments',      description: '💳 Payments & Razorpay Integration' },
      { name: 'Wallet',        description: '💰 Doctor Wallet, Settlements & Withdrawals' },
      { name: 'Handover',      description: '🔄 Doctor Handover Workflow' },
      { name: 'Chat',          description: '💬 In-App Messaging' },
      { name: 'Notifications', description: '🔔 Notifications' },
      { name: 'Reviews',       description: '⭐ Reviews & Ratings' },
      { name: 'Complaints',    description: '📋 Complaints & Support Tickets' },
      { name: 'Admin',         description: '🛡️ Super Admin & Clinic Admin' },
      { name: 'Reports',       description: '📊 Analytics & Reports' },
      { name: 'System',        description: '⚙️ Health & System' },
    ],
  },
  apis: [
    './src/modules/**/*.routes.js',
    './src/app.js',
  ],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
