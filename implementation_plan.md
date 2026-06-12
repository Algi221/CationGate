# Implementation Plan - PPDB SMK Taruna Bhakti Security Vulnerability Fixes

This plan addresses:
1. **Hardcoded Non-Cryptographic Secrets (CWE-547)**: Moving fallback admin usernames and passwords from source code to backend and frontend environment variables.
2. **Hardcoded Secrets (CWE-547)**: Removing hardcoded `JWT_SECRET` fallback keys from auth routes and middleware.
3. **Use of Hardcoded Credentials (CWE-798)**: Removing hardcoded mock development tokens from middleware and frontend contexts.
4. **SQL Injection Check (CWE-89)**: Audit of database queries across the application to ensure complete immunity.

---

## User Review Required

> [!IMPORTANT]
> **Environment Variables Setup**: 
> You will need to make sure the environment variables are correctly populated in `backend/.env` and `frontend/.env.local`. Example files will be provided.
> 
> **JWT Secret Verification**:
> We will configure the backend to throw an error if `JWT_SECRET` is missing from the environment, enforcing secure configuration in production.

---

## Open Questions

There are no major open questions at this stage. We have confirmed the list of hardcoded credentials and validated that all SQL queries are already properly parameterized.

---

## Proposed Changes

### Configuration Layer

#### [MODIFY] [backend/.env](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/.env)
* Add configuration variables:
  * `SUPER_ADMIN_USERNAME=super_admin_TB`
  * `SUPER_ADMIN_PASSWORD=AdminTarunaBhakti2026`
  * `ADMIN_USERNAME=admin_tb`
  * `ADMIN_PASSWORD=AdminTarunaBhakti2026`
  * `MOCK_JWT_TOKEN=mock_jwt_token_for_taruna_bhakti_dev_purposes`

#### [MODIFY] [backend/.env.example](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/.env.example)
* Document the new configuration keys for reference.

#### [NEW] [frontend/.env.local](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/.env.local)
* Add frontend env variables matching backend defaults:
  * `NEXT_PUBLIC_SUPER_ADMIN_USERNAME=super_admin_TB`
  * `NEXT_PUBLIC_SUPER_ADMIN_PASSWORD=AdminTarunaBhakti2026`
  * `NEXT_PUBLIC_ADMIN_USERNAME=admin_tb`
  * `NEXT_PUBLIC_ADMIN_PASSWORD=AdminTarunaBhakti2026`
  * `NEXT_PUBLIC_MOCK_JWT_TOKEN=mock_jwt_token_for_taruna_bhakti_dev_purposes`

#### [NEW] [frontend/.env.example](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/.env.example)
* Document public configuration keys for reference.

---

### Backend Service Layer

#### [MODIFY] [auth.ts](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/src/routes/auth.ts)
* Remove the hardcoded fallback `'PPDB_SMK_TarunaBhakti_SuperSecret_2026!'` for `JWT_SECRET`. Throw an error if it is not defined.
* Refactor the local development fallback database credentials check:
  * Load `SUPER_ADMIN_USERNAME`, `SUPER_ADMIN_PASSWORD`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD` from `process.env`.
  * Validate inputs against those environment variables.
  * Dynamically hash the password fallback securely on-demand, resolving both the vulnerability and the comparison logic bug.

#### [MODIFY] [auth.ts (middleware)](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/src/middleware/auth.ts)
* Remove the hardcoded fallback `'PPDB_SMK_TarunaBhakti_SuperSecret_2026!'` for `JWT_SECRET`. Throw an error if it is not defined.
* Remove the hardcoded mock token check. Read from `process.env.MOCK_JWT_TOKEN` instead.

---

### Frontend UI/UX Layer

#### [MODIFY] [PPDBContext.tsx](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/src/context/PPDBContext.tsx)
* Replace hardcoded local fallback check strings in `loginAdmin` with references to `process.env.NEXT_PUBLIC_SUPER_ADMIN_USERNAME`, `process.env.NEXT_PUBLIC_SUPER_ADMIN_PASSWORD`, `process.env.NEXT_PUBLIC_ADMIN_USERNAME`, `process.env.NEXT_PUBLIC_ADMIN_PASSWORD`, and `process.env.NEXT_PUBLIC_MOCK_JWT_TOKEN`.

---

## SQL Injection Audit Results

During our inspection of the codebase, we reviewed all SQL statements executed in:
* `backend/src/routes/applicants.ts`
* `backend/src/routes/auth.ts`
* `backend/src/routes/config.ts`
* `backend/src/routes/informasi.ts`
* `backend/src/routes/payment.ts`
* `backend/src/routes/admin-users.ts`
* `backend/seed.js`

**Conclusion**: All database queries strictly utilize parameterized inputs (using `$1`, `$2`, etc. placeholders passed as an array to `pool.query` or `client.query`). No dynamic string concatenation or template literal insertions containing unescaped raw user inputs were detected. The application is secure from SQL injection attacks.

---

## Verification Plan

### Automated Verification
* Run linter or compiler check on backend and frontend code to ensure no type errors:
  * Backend: Check compilation using Bun/TypeScript compile if needed.
  * Frontend: Ensure `process.env` properties compile correctly.
* Run the application and confirm correct login with environment-configured credentials.

### Manual Verification
1. Try logging in using the default fallbacks when the database is disabled, ensuring it correctly validates credentials defined in `.env`.
2. Test authenticating APIs with the mock token defined in `MOCK_JWT_TOKEN`.
3. Try setting an empty `JWT_SECRET` in `.env` to verify that the backend securely refuses to start.
