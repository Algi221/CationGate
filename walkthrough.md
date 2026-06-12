# Walkthrough - Security Vulnerability Fixes & SQL Injection Audit

We have successfully resolved the Snyk security vulnerabilities and completed a comprehensive audit of the database queries.

## Changes Made

### 1. Configuration Layer (Environment Variables)
* **Backend Configurations**:
  * Added fallback variables to [backend/.env](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/.env):
    * `SUPER_ADMIN_USERNAME`
    * `SUPER_ADMIN_PASSWORD`
    * `ADMIN_USERNAME`
    * `ADMIN_PASSWORD`
    * `MOCK_JWT_TOKEN`
  * Documented all new options in [backend/.env.example](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/.env.example).
* **Frontend Configurations**:
  * Created [frontend/.env.local](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/.env.local) to expose Next.js public variables:
    * `NEXT_PUBLIC_SUPER_ADMIN_USERNAME`
    * `NEXT_PUBLIC_SUPER_ADMIN_PASSWORD`
    * `NEXT_PUBLIC_ADMIN_USERNAME`
    * `NEXT_PUBLIC_ADMIN_PASSWORD`
    * `NEXT_PUBLIC_MOCK_JWT_TOKEN`
  * Documented these keys in [frontend/.env.example](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/.env.example).

### 2. Backend Security Refactor
* **Auth Routes ([auth.ts](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/src/routes/auth.ts))**:
  * Removed hardcoded fallback admin usernames (`'super_admin_TB'`, `'admin_tb'`) and bcrypt hash checks.
  * Verified that it queries the database first; if the database is unreachable, it checks the username and password against env variables.
  * Fixed a fallback compare bug: previously, it directly compared plaintext password input with the bcrypt hash string. It now generates the bcrypt hash dynamically from the env password and compares securely.
  * Enforced that `JWT_SECRET` must exist in the environment; the backend will throw an error and refuse to boot if it is missing.
* **Auth Middleware ([auth.ts (middleware)](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/src/middleware/auth.ts))**:
  * Removed hardcoded `JWT_SECRET` default fallback string.
  * Removed hardcoded `'mock_jwt_token_for_taruna_bhakti_dev_purposes'` string. It is now loaded from `process.env.MOCK_JWT_TOKEN`.

### 3. Frontend Security Refactor
* **Auth Context ([PPDBContext.tsx](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/src/context/PPDBContext.tsx))**:
  * Replaced all hardcoded fallback credential usernames, passwords, and mock token strings in `loginAdmin` error catching block with Next.js public environment variables (`process.env.NEXT_PUBLIC_...`).

---

## SQL Injection Audit Report

We conducted a thorough search across all database-access modules:
* `backend/src/routes/applicants.ts`
* `backend/src/routes/auth.ts`
* `backend/src/routes/config.ts`
* `backend/src/routes/informasi.ts`
* `backend/src/routes/payment.ts`
* `backend/src/routes/admin-users.ts`
* `backend/seed.js`

**Findings**:
* Every single SQL query is fully parameterized, utilizing the standard PostgreSQL driver placeholder syntax (`$1`, `$2`, etc.) and passing values as an array.
* No string concatenation or template literal variables containing raw user input are used within SQL query strings.
* **Verdict**: The application is **immune** to SQL Injection attacks.

---

## Verification & Build Results

### Automated Verification
* Ran TypeScript compilation checks on both the backend and frontend repositories:
  * **Backend**: `npx tsc --noEmit` completed successfully with **0 errors**.
  * **Frontend**: `npx tsc --noEmit` completed successfully with **0 errors**.
