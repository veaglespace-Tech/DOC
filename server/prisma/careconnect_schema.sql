-- ============================================================
-- CareConnect Healthcare SaaS Platform
-- MySQL 8.x Schema — Full Database Setup
-- Compatible with MySQL Workbench
-- ============================================================

CREATE DATABASE IF NOT EXISTS careconnect_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE careconnect_db;

-- ============================================================
-- AUTH & ACCESS CONTROL
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  uuid            VARCHAR(36)      NOT NULL,
  email           VARCHAR(255)     DEFAULT NULL,
  phone           VARCHAR(20)      DEFAULT NULL,
  password_hash   VARCHAR(255)     DEFAULT NULL,
  is_active       TINYINT(1)       NOT NULL DEFAULT 1,
  is_verified     TINYINT(1)       NOT NULL DEFAULT 0,
  last_login_at   DATETIME         DEFAULT NULL,
  created_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_uuid (uuid),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone),
  INDEX idx_users_email (email),
  INDEX idx_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS roles (
  id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(50)  NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (name) VALUES
  ('SUPER_ADMIN'),
  ('CLINIC_ADMIN'),
  ('DOCTOR'),
  ('PATIENT'),
  ('SUPPORT'),
  ('FINANCE_ADMIN');

CREATE TABLE IF NOT EXISTS permissions (
  id    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_permissions_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO permissions (name) VALUES
  ('doctor:approve'), ('doctor:reject'), ('doctor:suspend'),
  ('payment:refund'), ('payment:view'),
  ('audit:view'), ('settings:manage'),
  ('emergency:override'), ('reports:view');

CREATE TABLE IF NOT EXISTS user_roles (
  user_id  INT UNSIGNED NOT NULL,
  role_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (user_id, role_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id        INT UNSIGNED NOT NULL,
  permission_id  INT UNSIGNED NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  token       VARCHAR(512) NOT NULL,
  user_id     INT UNSIGNED NOT NULL,
  expires_at  DATETIME     NOT NULL,
  is_revoked  TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_refresh_token (token(255)),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_refresh_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS otp_records (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  type        ENUM('EMAIL_VERIFY','PHONE_VERIFY','LOGIN','PASSWORD_RESET') NOT NULL,
  otp         VARCHAR(10)  NOT NULL,
  expires_at  DATETIME     NOT NULL,
  is_used     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_otp_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- ORGANIZATIONS & MULTI-TENANT
-- ============================================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(100) NOT NULL,
  doctor_limit   INT          DEFAULT NULL,
  patient_limit  INT          DEFAULT NULL,
  features       JSON         DEFAULT NULL,
  price_monthly  DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_active      TINYINT(1)   NOT NULL DEFAULT 1,
  created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO subscription_plans (name, doctor_limit, patient_limit, price_monthly) VALUES
  ('Starter', 5, 100, 999.00),
  ('Pro', 25, 1000, 4999.00),
  ('Hospital', NULL, NULL, 19999.00);

CREATE TABLE IF NOT EXISTS organizations (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255) NOT NULL,
  subdomain   VARCHAR(100) NOT NULL,
  plan_id     INT UNSIGNED DEFAULT NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_org_subdomain (subdomain),
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PATIENTS
-- ============================================================

CREATE TABLE IF NOT EXISTS patients (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id           INT UNSIGNED  NOT NULL,
  name              VARCHAR(255)  NOT NULL,
  date_of_birth     DATE          DEFAULT NULL,
  gender            ENUM('MALE','FEMALE','OTHER') DEFAULT NULL,
  blood_group       VARCHAR(5)    DEFAULT NULL,
  address           TEXT          DEFAULT NULL,
  city              VARCHAR(100)  DEFAULT NULL,
  latitude          DECIMAL(10,8) DEFAULT NULL,
  longitude         DECIMAL(11,8) DEFAULT NULL,
  emergency_contact VARCHAR(20)   DEFAULT NULL,
  organization_id   INT UNSIGNED  DEFAULT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_patient_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS family_members (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id    INT UNSIGNED NOT NULL,
  name          VARCHAR(255) NOT NULL,
  relation      VARCHAR(50)  NOT NULL,
  date_of_birth DATE         DEFAULT NULL,
  blood_group   VARCHAR(5)   DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DOCTORS
-- ============================================================

CREATE TABLE IF NOT EXISTS doctors (
  id                      INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id                 INT UNSIGNED  NOT NULL,
  name                    VARCHAR(255)  NOT NULL,
  phone                   VARCHAR(20)   DEFAULT NULL,
  gender                  ENUM('MALE','FEMALE','OTHER') DEFAULT NULL,
  profile_image           VARCHAR(500)  DEFAULT NULL,
  bio                     TEXT          DEFAULT NULL,
  medical_reg_number      VARCHAR(100)  DEFAULT NULL,
  verification_status     ENUM('PENDING','VERIFIED','REJECTED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  is_online               TINYINT(1)    NOT NULL DEFAULT 0,
  is_available            TINYINT(1)    NOT NULL DEFAULT 0,
  is_emergency_available  TINYINT(1)    NOT NULL DEFAULT 0,
  service_radius_km       DECIMAL(5,2)  DEFAULT NULL,
  current_latitude        DECIMAL(10,8) DEFAULT NULL,
  current_longitude       DECIMAL(11,8) DEFAULT NULL,
  consultation_fee        DECIMAL(10,2) DEFAULT NULL,
  home_visit_fee          DECIMAL(10,2) DEFAULT NULL,
  emergency_fee           DECIMAL(10,2) DEFAULT NULL,
  experience_years        INT           DEFAULT NULL,
  rating                  DECIMAL(3,2)  DEFAULT 0.00,
  total_reviews           INT           NOT NULL DEFAULT 0,
  organization_id         INT UNSIGNED  DEFAULT NULL,
  kyc_approved_at         DATETIME      DEFAULT NULL,
  bank_account_number     VARCHAR(30)   DEFAULT NULL,
  bank_ifsc               VARCHAR(15)   DEFAULT NULL,
  bank_account_name       VARCHAR(255)  DEFAULT NULL,
  created_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at              DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_doctor_user (user_id),
  UNIQUE KEY uq_doctor_reg_number (medical_reg_number),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
  INDEX idx_doctor_status (verification_status),
  INDEX idx_doctor_available (is_available, is_emergency_available),
  INDEX idx_doctor_location (current_latitude, current_longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS doctor_specializations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doctor_id       INT UNSIGNED NOT NULL,
  specialization  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_spec_doctor (doctor_id),
  INDEX idx_spec_name (specialization)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS doctor_documents (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doctor_id    INT UNSIGNED NOT NULL,
  type         ENUM('DEGREE','LICENSE','KYC_ID','KYC_SELFIE','BANK_PASSBOOK','OTHER') NOT NULL,
  file_url     VARCHAR(500) NOT NULL,
  status       ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  review_note  TEXT         DEFAULT NULL,
  reviewed_at  DATETIME     DEFAULT NULL,
  reviewed_by  INT UNSIGNED DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_docs_doctor (doctor_id),
  INDEX idx_docs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS doctor_availability (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doctor_id   INT UNSIGNED NOT NULL,
  day_of_week TINYINT      NOT NULL COMMENT '0=Sunday, 6=Saturday',
  start_time  TIME         NOT NULL,
  end_time    TIME         NOT NULL,
  is_active   TINYINT(1)   NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_avail_doctor_day (doctor_id, day_of_week)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS vacation_blocks (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  doctor_id   INT UNSIGNED NOT NULL,
  start_date  DATE         NOT NULL,
  end_date    DATE         NOT NULL,
  reason      VARCHAR(255) DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE,
  INDEX idx_vacation_doctor (doctor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- EMERGENCY
-- ============================================================

CREATE TABLE IF NOT EXISTS emergency_requests (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  patient_id    INT UNSIGNED  NOT NULL,
  latitude      DECIMAL(10,8) NOT NULL,
  longitude     DECIMAL(11,8) NOT NULL,
  medical_needs TEXT          DEFAULT NULL,
  status        ENUM('SEARCHING','NOTIFYING','ASSIGNED','ESCALATED','COMPLETED','CANCELLED') NOT NULL DEFAULT 'SEARCHING',
  escalated_at  DATETIME      DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  INDEX idx_emergency_status (status),
  INDEX idx_emergency_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS emergency_assignments (
  id                   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  emergency_request_id INT UNSIGNED NOT NULL,
  doctor_id            INT UNSIGNED NOT NULL,
  notified_at          DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  responded_at         DATETIME     DEFAULT NULL,
  status               ENUM('NOTIFIED','ACCEPTED','REJECTED','TIMEOUT') NOT NULL DEFAULT 'NOTIFIED',
  timeout_at           DATETIME     NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (emergency_request_id) REFERENCES emergency_requests(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  INDEX idx_ea_request (emergency_request_id),
  INDEX idx_ea_doctor (doctor_id),
  INDEX idx_ea_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- APPOINTMENTS & VISITS
-- ============================================================

CREATE TABLE IF NOT EXISTS appointments (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id    INT UNSIGNED NOT NULL,
  doctor_id     INT UNSIGNED NOT NULL,
  service_type  ENUM('NORMAL','EMERGENCY','HOME_VISIT') NOT NULL DEFAULT 'NORMAL',
  scheduled_at  DATETIME     DEFAULT NULL,
  status        ENUM('REQUESTED','PAYMENT_PENDING','PAID','DOCTOR_ASSIGNED','DOCTOR_ACCEPTED',
                     'ON_THE_WAY','ARRIVED','IN_PROGRESS','COMPLETED','CANCELLED','REFUND')
                NOT NULL DEFAULT 'REQUESTED',
  cancel_reason TEXT         DEFAULT NULL,
  notes         TEXT         DEFAULT NULL,
  token_number  VARCHAR(20)  DEFAULT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  INDEX idx_appt_patient (patient_id),
  INDEX idx_appt_doctor (doctor_id),
  INDEX idx_appt_status (status),
  INDEX idx_appt_scheduled (scheduled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS visits (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  appointment_id    INT UNSIGNED  NOT NULL,
  doctor_latitude   DECIMAL(10,8) DEFAULT NULL,
  doctor_longitude  DECIMAL(11,8) DEFAULT NULL,
  arrived_at        DATETIME      DEFAULT NULL,
  started_at        DATETIME      DEFAULT NULL,
  completed_at      DATETIME      DEFAULT NULL,
  doctor_notes      TEXT          DEFAULT NULL,
  follow_up_date    DATE          DEFAULT NULL,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_visit_appointment (appointment_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS handover_requests (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  appointment_id   INT UNSIGNED NOT NULL,
  from_doctor_id   INT UNSIGNED NOT NULL,
  to_doctor_id     INT UNSIGNED DEFAULT NULL,
  reason           ENUM('UNAVAILABLE','EMERGENCY','SCHEDULE_CONFLICT','OUTSIDE_AREA','OTHER') NOT NULL,
  status           ENUM('PENDING','ACCEPTED','REJECTED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  patient_notified TINYINT(1)   NOT NULL DEFAULT 0,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT,
  FOREIGN KEY (from_doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  FOREIGN KEY (to_doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
  INDEX idx_handover_appt (appointment_id),
  INDEX idx_handover_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- PAYMENTS & FINANCE
-- ============================================================

CREATE TABLE IF NOT EXISTS payments (
  id                  INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  appointment_id      INT UNSIGNED   NOT NULL,
  patient_id          INT UNSIGNED   NOT NULL,
  gross_amount        DECIMAL(12,2)  NOT NULL,
  platform_fee        DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  tax_amount          DECIMAL(12,2)  NOT NULL DEFAULT 0.00,
  doctor_payable      DECIMAL(12,2)  NOT NULL,
  gateway_order_id    VARCHAR(100)   DEFAULT NULL,
  gateway_payment_id  VARCHAR(100)   DEFAULT NULL,
  gateway_signature   VARCHAR(512)   DEFAULT NULL,
  status              ENUM('INITIATED','PENDING','AUTHORIZED','CAPTURED','FAILED','REFUNDED','PARTIALLY_REFUNDED')
                      NOT NULL DEFAULT 'INITIATED',
  captured_at         DATETIME       DEFAULT NULL,
  created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_payment_appointment (appointment_id),
  UNIQUE KEY uq_gateway_order (gateway_order_id),
  UNIQUE KEY uq_gateway_payment (gateway_payment_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  INDEX idx_payment_status (status),
  INDEX idx_payment_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS refunds (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  payment_id      INT UNSIGNED  NOT NULL,
  amount          DECIMAL(12,2) NOT NULL,
  reason          TEXT          NOT NULL,
  initiated_by    ENUM('PATIENT','DOCTOR','ADMIN','SYSTEM') NOT NULL,
  gateway_ref_id  VARCHAR(100)  DEFAULT NULL,
  status          ENUM('PENDING','PROCESSED','FAILED') NOT NULL DEFAULT 'PENDING',
  processed_at    DATETIME      DEFAULT NULL,
  created_at      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE RESTRICT,
  INDEX idx_refund_payment (payment_id),
  INDEX idx_refund_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS doctor_wallets (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  doctor_id         INT UNSIGNED  NOT NULL,
  total_earnings    DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  pending_balance   DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  available_balance DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  withdrawn_amount  DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_wallet_doctor (doctor_id),
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS wallet_transactions (
  id            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  wallet_id     INT UNSIGNED  NOT NULL,
  payment_id    INT UNSIGNED  DEFAULT NULL,
  type          ENUM('CREDIT','DEBIT','HOLD','RELEASE','WITHDRAWAL') NOT NULL,
  amount        DECIMAL(12,2) NOT NULL,
  description   VARCHAR(500)  DEFAULT NULL,
  reference_id  VARCHAR(100)  DEFAULT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (wallet_id) REFERENCES doctor_wallets(id) ON DELETE RESTRICT,
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL,
  INDEX idx_wtxn_wallet (wallet_id),
  INDEX idx_wtxn_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settlements (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  wallet_id    INT UNSIGNED  NOT NULL,
  amount       DECIMAL(12,2) NOT NULL,
  hold_until   DATETIME      NOT NULL COMMENT '24h hold configurable from system_settings',
  released_at  DATETIME      DEFAULT NULL,
  status       ENUM('HOLDING','RELEASED','FAILED') NOT NULL DEFAULT 'HOLDING',
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (wallet_id) REFERENCES doctor_wallets(id) ON DELETE RESTRICT,
  INDEX idx_settlement_status (status),
  INDEX idx_settlement_hold (hold_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS withdrawals (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  wallet_id        INT UNSIGNED  NOT NULL,
  amount           DECIMAL(12,2) NOT NULL,
  bank_account     VARCHAR(30)   DEFAULT NULL,
  ifsc_code        VARCHAR(15)   DEFAULT NULL,
  utr_number       VARCHAR(50)   DEFAULT NULL COMMENT 'Bank UTR/reference',
  status           ENUM('REQUESTED','PROCESSING','COMPLETED','FAILED','REJECTED') NOT NULL DEFAULT 'REQUESTED',
  requested_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  processed_at     DATETIME      DEFAULT NULL,
  reject_reason    VARCHAR(500)  DEFAULT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (wallet_id) REFERENCES doctor_wallets(id) ON DELETE RESTRICT,
  INDEX idx_withdrawal_status (status),
  INDEX idx_withdrawal_wallet (wallet_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- MEDICAL DATA
-- ============================================================

CREATE TABLE IF NOT EXISTS prescriptions (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  visit_id    INT UNSIGNED NOT NULL,
  doctor_id   INT UNSIGNED NOT NULL,
  medicines   JSON         DEFAULT NULL COMMENT 'Array of {name, dosage, frequency, duration}',
  notes       TEXT         DEFAULT NULL,
  pdf_url     VARCHAR(500) DEFAULT NULL,
  signature   TEXT         DEFAULT NULL COMMENT 'Digital signature hash',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  INDEX idx_rx_visit (visit_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS medical_documents (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  visit_id    INT UNSIGNED NOT NULL,
  type        VARCHAR(50)  NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (visit_id) REFERENCES visits(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS medical_records (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id   INT UNSIGNED NOT NULL,
  title        VARCHAR(255) NOT NULL,
  record_type  ENUM('BLOOD_TEST','XRAY','ECG','REPORT','SCAN','OTHER') NOT NULL,
  file_url     VARCHAR(500) DEFAULT NULL,
  notes        TEXT         DEFAULT NULL,
  recorded_at  DATE         NOT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  INDEX idx_medrecord_patient (patient_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- COMMUNICATION
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED NOT NULL,
  title       VARCHAR(255) NOT NULL,
  body        TEXT         NOT NULL,
  type        ENUM('APPOINTMENT','PAYMENT','EMERGENCY','SYSTEM','HANDOVER') NOT NULL,
  entity_id   INT UNSIGNED DEFAULT NULL,
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  channels    JSON         DEFAULT NULL COMMENT '["IN_APP","PUSH","SMS","EMAIL"]',
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user_read (user_id, is_read),
  INDEX idx_notif_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS conversations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  appointment_id  INT UNSIGNED NOT NULL,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_conv_appointment (appointment_id),
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  conversation_id  INT UNSIGNED NOT NULL,
  sender_id        INT UNSIGNED NOT NULL,
  type             ENUM('TEXT','IMAGE','DOCUMENT','LOCATION','SYSTEM') NOT NULL DEFAULT 'TEXT',
  content          TEXT         NOT NULL,
  file_url         VARCHAR(500) DEFAULT NULL,
  created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_msg_conversation (conversation_id),
  INDEX idx_msg_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- REVIEWS & COMPLAINTS
-- ============================================================

CREATE TABLE IF NOT EXISTS reviews (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id      INT UNSIGNED NOT NULL,
  doctor_id       INT UNSIGNED NOT NULL,
  appointment_id  INT UNSIGNED NOT NULL,
  rating          TINYINT      NOT NULL COMMENT '1-5',
  review          TEXT         DEFAULT NULL,
  is_published    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_appointment (appointment_id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE RESTRICT,
  FOREIGN KEY (appointment_id) REFERENCES appointments(id) ON DELETE RESTRICT,
  INDEX idx_review_doctor (doctor_id),
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS complaints (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  patient_id   INT UNSIGNED NOT NULL,
  category     ENUM('DOCTOR','PAYMENT','VISIT','REFUND','TECHNICAL','OTHER') NOT NULL,
  description  TEXT         NOT NULL,
  status       ENUM('OPEN','IN_PROGRESS','RESOLVED','CLOSED') NOT NULL DEFAULT 'OPEN',
  assigned_to  INT UNSIGNED DEFAULT NULL,
  resolved_at  DATETIME     DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE RESTRICT,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_complaint_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- AUDIT LOGS & SYSTEM SETTINGS
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED DEFAULT NULL,
  user_role   VARCHAR(50)  DEFAULT NULL,
  action      VARCHAR(100) NOT NULL COMMENT 'e.g. DOCTOR_APPROVED, PAYMENT_REFUNDED',
  entity      VARCHAR(50)  NOT NULL COMMENT 'e.g. Doctor, Payment',
  entity_id   INT UNSIGNED DEFAULT NULL,
  prev_value  JSON         DEFAULT NULL,
  new_value   JSON         DEFAULT NULL,
  ip_address  VARCHAR(45)  DEFAULT NULL,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_entity (entity, entity_id),
  INDEX idx_audit_user (user_id),
  INDEX idx_audit_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS system_settings (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `key`       VARCHAR(100) NOT NULL,
  value       VARCHAR(500) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_settings_key (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO system_settings (`key`, value, description) VALUES
  ('settlement_hold_hours', '24', 'Hours to hold doctor earnings before release'),
  ('platform_commission_pct', '15', 'Platform commission percentage on each payment'),
  ('emergency_timeout_seconds', '60', 'Seconds before moving to next doctor in emergency'),
  ('max_handover_attempts', '3', 'Max times a handover can be requested per appointment'),
  ('min_withdrawal_amount', '500', 'Minimum withdrawal amount in INR');

-- ============================================================
-- FINAL: Show all tables
-- ============================================================
SHOW TABLES;
