# ReBank — Omni-Channel Bank Account Recovery Orchestration Platform

ReBank is an omni-channel bank account recovery platform designed to eliminate branch bottlenecks when customer accounts are frozen or restricted due to statutory KYC expiration, dormancy, AML velocity alerts, credential compromise, or regulatory liens.

The platform provides a self-service customer recovery workflow with automated simulated AI/OCR extraction, biometric liveness verification, multi-language support (English and தமிழ் / Tamil), and a dual-control (Maker-Checker / Four-Eyes Principle) Bank Operations Cockpit connected to a simulated Core Banking System (CBS) adapter.

---

## 1. System Architecture

```
+---------------------------------------------------------------------------------------------------+
|                                    REBANK PLATFORM ARCHITECTURE                                   |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|   +------------------------------------------+    +-------------------------------------------+   |
|   |         CUSTOMER WEB & MOBILE APP        |    |        BANK OPERATIONS WEB COCKPIT        |   |
|   |  - Mobile Smartphone Frame Toggle        |    |  - Reviewer (Maker / L1) Triage Queue     |   |
|   |  - Bilingual i18n (English / தமிழ்)      |    |  - Approver (Checker / L2) Dual Sign-off  |   |
|   |  - Transparent Restriction Diagnostics   |    |  - Four-Eyes Principle Enforcement        |   |
|   |  - 4-Step Recovery Application Wizard    |    |  - Core Banking Hold Release Execution    |   |
|   |  - Granular Status Timeline Tracker      |    |  - Immutable Audit Log Stream             |   |
|   |  - Notifications & Grievance Redressal   |    |  - CBS Fault / Latency Simulator          |   |
|   +---------------------+--------------------+    +---------------------+---------------------+   |
|                         |                                               |                         |
|                         +-----------------------+-----------------------+                         |
|                                                 | HTTP / JSON REST API                            |
|                                                 v                                                 |
|   +-------------------------------------------------------------------------------------------+   |
|   |                                     REBANK BACKEND API                                    |   |
|   |  - Express REST API with Role-Based Access Control (RBAC) & JWT Authentication            |   |
|   |  - IDOR Prevention (strict customer account ownership validation)                         |   |
|   |  - Idempotency Engine (Idempotency-Key header support preventing duplicate submissions)   |   |
|   |  - Centralized Standard Error Handling & Rate Limiting                                    |   |
|   |  - Automated Simulated AI/OCR Extraction & Biometric Face Match Evaluation                |   |
|   |  - Sanitized Immutable Audit Logger (passwords, tokens, and PINs strictly redacted)       |   |
|   +---------------------+-----------------------------------+---------------------------------+   |
|                         |                                   |                                     |
|                         v                                   v                                     |
|   +------------------------------------------+    +-------------------------------------------+   |
|   |         PERSISTENT DATABASE LAYER        |    |      CORE BANKING (CBS) ADAPTER           |   |
|   |  - Prisma Relational Schema (PostgreSQL) |    |  - Provider-Neutral BankIntegrationAdapter|   |
|   |  - Node 24 Native SQLite Adapter         |    |  - High-Fidelity Mock CBS Sandbox         |   |
|   |  - 11 Relational Tables & Migrations     |    |  - Simulated Latency, Faults & Reference  |   |
|   |  - Persistent disk file: data/rebank.db  |    |  - Production Banking Actions Disabled    |   |
|   +------------------------------------------+    +-------------------------------------------+   |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Database & Environment Configuration

### Database Persistence & PostgreSQL Status Note
- **PostgreSQL Requirement:** The system includes a complete relational Prisma schema (`prisma/schema.prisma`) and SQL DDL (`src/db/schema.sql`) for PostgreSQL.
- **Environment Status:** On the current local development machine, PostgreSQL is not installed as an active Windows service (`psql` not in PATH). 
- **Active Persistent Adapter:** The platform operates using the persistent SQLite database adapter powered by Node.js 24's native `DatabaseSync` engine located at `./data/rebank.db`. Data submitted by customers persists to disk across page refreshes and server restarts.
- **Production PostgreSQL Migration:** To switch to PostgreSQL in staging or production, update `.env`:
  ```ini
  DATABASE_URL=postgresql://user:password@localhost:5432/rebank?schema=public
  DB_DRIVER=postgresql
  ```

### Relational Schema Tables
1. `users` — Auth credentials with bcrypt hashes, roles (`CUSTOMER`, `REVIEWER`, `APPROVER`, `ADMIN`), MFA flags.
2. `customer_profiles` — Customer number, risk ratings, KYC status, contact information.
3. `account_references` — Masked account numbers (`•••• •••• •••• 1002`), account types, balances, CBS references.
4. `account_restrictions` — Six restriction profiles, severity tiers, checklists, statutory authorities.
5. `recovery_requests` — Unique reference numbers (`REB-YYYY-XXXXX`), states, notes, timestamps.
6. `request_status_histories` — Complete status transition audit timeline.
7. `documents` — Uploaded evidence artifacts, file paths, simulated OCR confidence and face match scores.
8. `review_decisions` — Maker recommendations and Checker authorization notes.
9. `notifications` — In-app, SMS, and Email customer alert logs.
10. `complaints` — Customer grievances with multi-tier escalation support (Tier 1 &rarr; Tier 2 &rarr; Tier 3).
11. `audit_events` — Immutable security event logs with credential redaction.

---

## 3. Demo Credentials Matrix

| Role | Name | Email | Password | Pre-loaded Scenario |
| :--- | :--- | :--- | :--- | :--- |
| **Customer** | Elena Rostova | `elena.rostova@example.com` | `Customer@123` | **KYC Expired hold** on $5,800.50 Savings Account. Ready for recovery form submission. |
| **Customer** | John Doe | `john.doe@example.com` | `Customer@123` | **Dormant Account hold**. Case already reviewed by Maker; ready for L2 Checker authorization. |
| **Customer** | Marcus Vance | `marcus.vance@example.com` | `Customer@123` | **AML Suspicious Wire hold** on $84,000.00. High-risk review queue. |
| **Reviewer (Maker L1)** | Alex Mercer | `reviewer@rebank.internal` | `Reviewer@123` | L1 compliance triage queue, OCR inspection, recommendation actions. |
| **Approver (Checker L2)**| Diana Ross | `approver@rebank.internal` | `Approver@123` | L2 dual-control sign-off. Enforces Four-Eyes principle; triggers CBS unfreeze. |
| **Administrator** | SysAdmin | `admin@rebank.internal` | `Admin@123` | Full immutable audit trail, CBS telemetry and fault simulator, factory reset. |

---

## 4. Quick Start & Execution Commands

### Prerequisites
- Node.js v24.x or v20.x+
- npm v10+

### Start the ReBank Application
Run the backend API and frontend single-page application:
```bash
cmd.exe /c "npm start"
```
Or directly with Node:
```bash
node src/server.js
```
The server will boot and serve on:
- **Application URL:** [http://localhost:3000](http://localhost:3000)
- **API Health Check:** [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Database Readiness Probe:** [http://localhost:3000/api/ready](http://localhost:3000/api/ready)
- **OpenAPI 3.0 Documentation:** [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

### Run the Automated Test Suite
To execute the complete 24-test integration and QA verification suite:
```bash
cmd.exe /c "npm test"
```
Or:
```bash
node tests/api.test.js
```

### Reset Database State to Factory Seed
To reset and re-seed all accounts, restrictions, and demo tickets:
```bash
node src/db/seed.js
```
*(Also accessible directly via the "Reset Demo State" button in the Admin UI).*

---

## 5. End-to-End Verification Walkthrough

1. Open [http://localhost:3000](http://localhost:3000) in your browser.
2. Click the **Elena (KYC)** demo role button on the top toolbar.
3. Observe the **Account Restriction Banner** highlighting the KYC expiration on account `•••• 1002`.
4. Click **Start Account Recovery** to open the 4-step wizard:
   - **Step 1 (Diagnosis):** Confirm contact details.
   - **Step 2 (Identity):** Click **Capture Liveness Selfie** (simulates biometric face match).
   - **Step 3 (Documents):** Select or drag a photo ID and address proof.
   - **Step 4 (Review & Sign):** Check the legal consent box and click **Submit Recovery Application**.
5. A unique reference number (`REB-2026-XXXXX`) is generated and persisted.
6. Click **Maker L1** in the top role toolbar to switch to Bank Reviewer Alex Mercer:
   - In the Reviewer Queue, find Elena's case and click **Claim Case**.
   - Click **Inspect Case** to view the baseline data, OCR confidence (98%), and biometric match score.
   - Click **✓ Recommend for Approval**.
7. Click **Checker L2** in the top role toolbar to switch to Bank Approver Diana Ross:
   - Notice the **Four-Eyes Principle** validation badge (**✓ Dual-Control Compliant**).
   - Click **Review & Authorize** &rarr; **⚖️ Authorize & Release CBS Hold**.
   - The Core Banking System adapter releases the restriction and returns transaction reference `CBS-UNFREEZE-XXXXXX`.
8. Switch back to **Elena (KYC)**:
   - Her account status is now **ACTIVE (RESTORED)**.
   - The status timeline displays all 4 stages completed with the verified CBS reference number.
9. Click **தமிழ்** in the language switcher to see the full bilingual Tamil interface.
10. Click **Mobile View** to toggle the realistic smartphone device container.
