# BUSINESS REQUIREMENTS DOCUMENT (BRD)

## 1. Product Overview

**Product:** Doctor-on-Demand & Healthcare SaaS Platform
The platform will connect patients, doctors, clinics, organizations, and administrators through a centralized healthcare service platform.

- **Patients** will be able to discover verified doctors, view their availability and consultation charges, book normal appointments, request emergency doctor visits, make online payments, track visits, and access complete visit and payment history.
- **Doctors** will be able to manage their profiles, availability, consultation charges, appointments, emergency requests, patients, visits, earnings, transactions, handovers, settlements, and withdrawals.
- **Super Admins** will have complete control over doctors, patients, clinics, organizations, appointments, emergency requests, payments, settlements, withdrawals, reports, complaints, system settings, and platform operations.
- The platform will be designed to support **multi-tenant SaaS architecture** in the future, allowing multiple organizations and clinics to operate independently within the same platform.

## 2. Technology Stack

| Layer                   | Technology                                      |
| ----------------------- | ----------------------------------------------- |
| Frontend                | Next.js + Javascript                            |
| UI                      | Tailwind CSS + shadcn/ui                        |
| State Management        | Redux Toolkit                                   |
| API State Management    | RTK Query                                       |
| Form Management         | React Hook Form                                 |
| Validation              | Zod                                             |
| Backend                 | Node.js + Express.js + Javascript               |
| ORM                     | Prisma                                          |
| Database                | MySQL 8.x                                       |
| Real-time Communication | Socket.IO                                       |
| Cache                   | Redis                                           |
| Background Jobs         | BullMQ                                          |
| Payment Gateway         | Razorpay / Suitable Marketplace Payment Gateway |
| File Storage            | S3 / Cloudinary                                 |
| Notifications           | Email + SMS + Push + WhatsApp                   |
| Maps & Location         | Google Maps                                     |
| API Documentation       | Swagger / OpenAPI                               |
| Deployment              | Linux VPS + Docker + Nginx                      |
| CI/CD                   | GitHub Actions                                  |
| Monitoring              | Sentry                                          |

**Architecture**
The initial application will follow a Modular Monolith Architecture.
As the platform grows, high-load or independent modules can be separated into dedicated services when required.

## 3. User Roles

### 3.1 Patient

Patients can:

- Search for doctors
- View doctor profiles
- Check availability and charges
- Book appointments
- Request emergency doctor visits
- Make online payments
- Track appointments and visits
- Access invoices and medical documents
- View visit and payment history
- Communicate with doctors
- Submit reviews and complaints

### 3.2 Doctor

Doctors can:

- Create and manage their profiles
- Submit verification documents
- Manage availability
- Set consultation and visit charges
- Accept or reject appointments
- Accept or reject emergency requests
- Manage visits and patients
- View earnings and transactions
- Request handovers
- Manage settlements
- Withdraw eligible earnings

### 3.3 Clinic / Organization

Clinics and organizations can:

- Manage clinic profiles
- Manage doctors
- Manage staff
- Manage patients
- Manage appointments
- Configure working hours and services
- Manage clinic operations

### 3.4 Super Admin

Super Admin has complete control over the platform and can manage:

- Users, Doctors, Patients, Clinics, Organizations
- Appointments, Emergency requests, Payments, Transactions, Settlements, Withdrawals
- Complaints, Reports, System settings, Audit logs

### 3.5 Support / Operations

Support and Operations users can manage:

- Emergency requests
- Appointment issues
- Doctor assignment issues
- Complaints, Customer support, Operational escalations

### 3.6 Finance Admin

Finance Admin can manage:

- Payments, Refunds, Transactions, Settlements, Withdrawals, Financial reports

_The system will use Role-Based Access Control (RBAC) and permission-based authorization._

## 4. Patient Module

The Patient module will include:

- Registration, Login, OTP authentication
- Profile management
- Doctor search, filtering, profile viewing
- Doctor availability, charges, ratings and reviews
- Normal appointment booking, Emergency doctor requests
- Online payment
- Appointment tracking, Doctor arrival tracking, Visit status tracking
- In-app communication
- Visit history, Payment history
- Invoice/PDF generation, Medical document access
- Reviews and ratings, Notifications, Complaints and support

**Doctor Search Filters**
Specialization, Location, Distance, Availability, Emergency availability, Consultation charges, Experience, Rating, Language, Clinic

**Doctor Card**
Doctor search results should display:
Doctor Name + Specialization + Experience + Distance + Availability + Charges + Rating + Verification Status

## 5. Doctor Module

**Doctor Registration:** Personal information, Qualification, Specialization, Medical registration details, Professional experience, Clinic information, KYC documents, Professional documents, Bank details
**Doctor Verification:** Doctors must be verified by the Admin before they can become publicly available on the platform.
**Doctor Dashboard:** Today's visits, Upcoming appointments, Emergency requests, Active visit, Patients, Visit history, Availability management, Working hours, Breaks, Leave management, Emergency availability, Service radius, Current location, Consultation charges, Home visit charges, Emergency visit charges, Earnings, Pending balance, Available balance, Transactions, Settlements, Withdrawals, Notifications, Handover requests

## 6. Doctor Availability Management

Doctors will be able to manage: Online/Offline status, Available/Unavailable status, Working hours, Breaks, Leave, Emergency availability, Service radius, Current location.
_The system must not rely only on a simple isAvailable boolean._
Doctor eligibility should consider: Current availability, Working schedule, Emergency availability, Current workload, Current location, Service radius, Existing assignments

## 7. Emergency Doctor Request System

**Workflow:**
Patient → Emergency Request → Location + Medical Service Requirement → Find Eligible Doctors → Notify Doctors → Accept / Reject / Timeout → Doctor Assigned → Patient Notified → Doctor Visit

**Doctor Eligibility:**
The system will consider: Doctor verification status, Specialization, Current availability, Emergency availability, Location, Distance, Service radius, Current workload.
If a doctor does not respond within the configured response time, the system can automatically send the request to the next eligible doctor. If no doctor accepts the request, the system will escalate the request to the Operations/Admin team.

**Emergency Safety:**
The platform must clearly distinguish between Doctor-on-demand/home-visit services and Life-threatening medical emergencies requiring emergency medical services or hospital care. The platform must not independently diagnose or determine medical severity.

## 8. Appointment & Visit Management

**Normal Booking Flow:**
Search Doctor → Select Service → Select Date & Time → View Charges → Make Payment → Booking Confirmed → Doctor Visit → Visit Completed

**Visit Statuses:**
REQUESTED, PAYMENT_PENDING, PAID, DOCTOR_ASSIGNED, DOCTOR_ACCEPTED, ON_THE_WAY, ARRIVED, IN_PROGRESS, COMPLETED, CANCELLED, REFUND

Doctors will be able to record appropriate: Visit information, Prescriptions, Documents, Follow-up information, Relevant medical notes

## 9. Doctor Handover System

If the assigned doctor cannot attend the visit, the doctor can initiate a handover request.
**Handover Flow:**
Doctor A → Handover Request → Select Reason → Find Eligible Doctor → Doctor B Notified → Doctor B Accepts → Patient Notified → Assignment Transferred

**Handover Reasons:** Doctor unavailable, Emergency, Schedule conflict, Outside service area, Other
_The original doctor assignment must remain in the system history. Handover must never overwrite or delete the previous assignment._

## 10. Payment System

Patients will make payments through the platform.
Actual platform commission, taxes, payment fees, and other applicable charges must be configurable.
**Payment Statuses:** INITIATED, PENDING, AUTHORIZED, CAPTURED, FAILED, REFUNDED, PARTIALLY_REFUNDED
_Payment success must always be verified by the backend using the payment gateway response/webhook. The frontend payment success response must never be treated as the final proof of payment. Duplicate payment webhooks must not create duplicate financial transactions. All financial operations must be designed to be idempotent._

## 11. Doctor Wallet & Settlement System

After a visit is successfully completed:
Visit Completed → Doctor Earnings Created → Settlement Hold → 24 Hours / Configured Settlement Period → Available Balance → Withdrawal

**Doctor Wallet:** The doctor dashboard will display Total Earnings, Pending Balance, Available Balance, Withdrawn Amount. Only eligible available earnings can be withdrawn.
**Withdrawal Statuses:** REQUESTED, PROCESSING, COMPLETED, FAILED, REJECTED
_The 24-hour settlement hold must be configurable from the platform settings._

## 12. Financial Transaction Ledger

Every financial event must be fully traceable. Each transaction should contain:
Transaction ID, Payment ID, Patient ID, Doctor ID, Appointment/Visit ID, Gross amount, Platform commission, Doctor payable amount, Taxes/fees, Refund amount, Settlement status, Withdrawal reference, Created date/time, Updated date/time
_The system must never depend on frontend-controlled wallet balances. Financial balances must be calculated and maintained using a reliable transaction/ledger system._

## 13. Refund & Cancellation Management

The platform must support: Patient cancellation, Doctor cancellation, No doctor available, Failed visit, Duplicate payment, Admin-approved refund, Partial refund
Cancellation and refund rules must be configurable. Every refund must reference the original payment transaction. Financial history must not be casually deleted.

## 14. Notifications & Communication

The platform will support: In-app notifications, Push notifications, Email, SMS, WhatsApp
**Real-Time Communication:** Real-time events will use Socket.IO. Patient-doctor communication can support Text messages, Images, Documents, Location sharing, System messages.

## 15. Super Admin Panel

**Dashboard:** Total patients, Total doctors, Active doctors, Today's visits, Emergency requests, Gross revenue, Platform commission, Doctor payable amount, Pending settlements, Withdrawals, Refunds
**Management Modules:** Admin can manage Doctors, Patients, Clinics, Organizations, Appointments, Visits, Emergency requests, Payments, Transactions, Refunds, Settlements, Withdrawals, Complaints, Reviews, Notifications, Documents, Reports, System settings, Audit logs
Admin can: Approve doctors, Reject doctors, Suspend doctors, Activate doctors, Manage platform configurations

## 16. Reports & Analytics

- **Patient Reports:** Visit history, Emergency visit history, Payment history, Total spending, Doctors consulted, Invoices
- **Doctor Reports:** Daily earnings, Weekly earnings, Monthly earnings, Completed visits, Emergency visits, Pending earnings, Available earnings, Withdrawals, Refunds, Transactions
- **Super Admin Reports:** Gross revenue, Platform commission, Doctor payouts, Transactions, Visits, Patients, Doctors, Emergency requests, Cancellations, Refunds, Settlements, Withdrawals
  _Reports must support: Filtering, Pagination, Date ranges, Search, Sorting, Export_

## 17. Clinic & Multi-Tenant SaaS Module

The platform should support a future multi-tenant structure. Relevant business entities should support organization_id or equivalent tenant isolation.
**Future SaaS Features:** Subscription plans (Free, Basic, Pro, Enterprise), Doctor limits, Staff limits, Patient limits, Appointment limits, Feature-based access, Organization billing, Subscription management

## 18. Medical Documents & Patient Data

The system may manage: Prescriptions, Medical reports, Visit documents, Medical attachments, Patient records
_Access must be strictly permission-based. Sensitive patient and medical information must never be exposed through public APIs. Users must only be able to access resources they are authorized to access._

## 19. Reviews & Complaints

After an eligible completed visit, the patient can submit: Rating, Review
**Complaint Categories:** Doctor issue, Payment issue, Visit issue, Refund issue, Technical issue, Other
**Ticket Status:** OPEN → IN_PROGRESS → RESOLVED → CLOSED

## 20. Security Requirements

The platform must implement: HTTPS, Secure password hashing, JWT authentication, Refresh tokens, Role-Based Access Control, Permission-based authorization, Input validation, Rate limiting, Secure HTTP headers, CORS configuration, File validation, API authorization, Secure secret management, Audit logging, Sensitive data protection
_The backend must validate resource ownership and permissions on every protected resource._

## 21. Audit Logging

The system must maintain audit logs for critical actions: Doctor approval/rejection/suspension, Appointment modifications, Doctor assignment, Doctor handover, Payments, Refunds, Commission changes, Settlements, Withdrawals, User suspension, Important configuration changes
**Audit Log Data:** User, Role, Action, Entity, Entity ID, Previous value, New value, IP address, Timestamp

## 22. Database — Core Tables

Authentication & Access: users, roles, permissions, user_roles
Users & Organizations: patients, doctors, clinics, organizations
Doctor Management: doctor_documents, doctor_specializations, doctor_availability, doctor_locations
Emergency: emergency_requests, emergency_assignments
Appointments & Visits: appointments, visits, visit_assignments, handover_requests
Payments & Finance: payments, payment_transactions, refunds, doctor_wallets, wallet_transactions, settlements, withdrawals
Communication: notifications, notification_logs, conversations, messages
Medical Data: medical_records, prescriptions, medical_documents
Feedback & Support: reviews, complaints, support_tickets
Billing & SaaS: invoices, subscription_plans, subscriptions
System: audit_logs, system_settings

## 23. Backend Project Structure

```
backend/
└── src/
    ├── config/
    ├── middlewares/
    ├── utils/
    ├── validators/
    ├── modules/
    │   ├── auth/
    │   ├── users/
    │   ├── patients/
    │   ├── doctors/
    │   ├── clinics/
    │   ├── availability/
    │   ├── emergency/
    │   ├── appointments/
    │   ├── visits/
    │   ├── handover/
    │   ├── payments/
    │   ├── transactions/
    │   ├── wallet/
    │   ├── settlements/
    │   ├── withdrawals/
    │   ├── notifications/
    │   ├── chat/
    │   ├── reports/
    │   ├── reviews/
    │   ├── complaints/
    │   ├── admin/
    │   ├── audit/
    │   └── settings/
    ├── app.ts
    └── server.ts
```

## 24. API Structure

All APIs should be versioned (e.g., /api/v1/auth). API documentation will be maintained using Swagger/OpenAPI.

## 25. Responsive & UI Requirements

The entire platform must be fully responsive across Mobile, Tablet, Laptop, Desktop, Large screens. Patient application follows mobile-first approach. No horizontal overflow, no broken layouts.

## 26. Performance & Reliability

Proper database indexes, Pagination, Optimized queries, Redis caching, Background job queues (BullMQ), Image optimization, API rate limiting, Automated database backups.

## 27. Testing Requirements

Unit testing, API testing, Integration testing, Payment testing, Emergency workflow testing, Handover testing, Settlement testing, Withdrawal testing, Permission/security testing, End-to-end testing, Responsive testing.

## 28. Development Phases

Phase 1 — Core MVP
Phase 2 — Advanced Operations
Phase 3 — SaaS
Phase 4 — Mobile & Advanced Features

## 31. Final Product Definition

This product is a:
Doctor-on-Demand Marketplace + Emergency Doctor Dispatch Platform + Healthcare Management Platform + Payment & Settlement Platform + Multi-Tenant SaaS Platform
