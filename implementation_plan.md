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

---

## Additional User Requests (Pending)

### Telegram Login Notifications

- **Goal**: Send a Telegram message to each user when they successfully log into the admin dashboard.
- **Approach**:
  1. Store each admin's Telegram `chat_id` in the `admin_users` table (add a new nullable column `telegram_chat_id`).
  2. Extend the login flow (`backend/src/routes/auth.ts`) to after successful JWT issuance, fetch the user's `telegram_chat_id` and, if present, call the Telegram Bot API `sendMessage` with a concise login notification (including timestamp and IP address).
  3. Provide a simple admin UI under **Kelola UI/Data** to manage each user's `chat_id`.
  4. In production, the bot token will be read from the environment variable `TELEGRAM_BOT_TOKEN`.

### UI/UX Enhancements

1. **Rename Sidebar Item**
   - Change the label "Kelola UI" to "Kelola UI/Data" in `frontend/src/app/dashboard/layout.tsx` and update any related navigation links.

2. **Symmetric Sidebar Collapse**
   - Already adjusted; ensure CSS uses flex centering and consistent width.

3. **Registration Form Customisation (Kelola UI/Data page)**
   - Expose a CRUD interface allowing admins to edit each field of the `/daftarr` wizard:
     - Field label, placeholder, required/optional flag, visibility toggle.
   - Store configuration in a new table `registration_fields` with columns:
     - `id`, `step_number`, `field_name`, `label`, `placeholder`, `is_required`, `is_visible`.
   - Update the registration wizard (`frontend/src/app/daftar/page.tsx`) to read this config via an API endpoint (`GET /api/registration-fields`) and render accordingly.
   - Add a button on **Kelola UI/Data** that opens a management UI (React form) to edit these settings.

4. **Upload Bukti Prestasi Change**
   - Replace the upload component with a static advisory text: "Harap membawa sertifikat prestasi fisik ke sekolah".
   - Remove file upload handling from the backend route `POST /api/upload-prestasi`.

5. **Omit "Tersisa X kursi"**
   - In step 7 of the registration wizard, hide the remaining seats counter.
   - Update the related component to conditionally render based on a new config flag `show_remaining_seats` stored in `registration_fields` (or a global setting).

6. **Add Major Logo and Sync with CRUD Majors**
   - Extend the `jurusan` (major) CRUD admin page to allow uploading a logo image.
   - Store the logo path in the `jurusan` table (`logo_path`).
   - In the registration wizard's "Program Keahlian" selection step, display each major's logo next to its name.
   - Ensure that when a new major is added via the admin UI, it automatically appears in the registration options.

### Admin Configurable UI/Data Page

- Consolidate all UI configuration under the renamed **Kelola UI/Data** page.
- Provide tabs or sections for:
  1. **Telegram Settings** – manage `telegram_chat_id` per admin.
  2. **Registration Fields** – edit labels, requirements, visibility.
  3. **Major Management** – CRUD majors with logo upload.
  4. **General Settings** – toggle features like "Show remaining seats".

### XSS Hardening

- Review remaining raw HTML insertions (e.g., in `frontend/src/app/forum/page.tsx`).
- Replace any direct `dangerouslySetInnerHTML` usage with sanitized content via `dompurify`.
- Ensure any user‑generated content displayed in the forum is passed through a sanitiser before rendering.

### Session Expiration Fix

1. **JWT Expiration Claim**
   - When issuing JWTs in `backend/src/routes/auth.ts`, include an `exp` claim set to `Math.floor(Date.now() / 1000) + (60 * 60 * 24)` (24‑hour validity) or configurable via env `JWT_EXPIRES_IN`.
2. **Middleware Enforcement**
   - Update `backend/src/middleware/auth.ts` to verify the token's expiration; `jwt.verify` will automatically reject expired tokens, but ensure any catch block re‑throws an authentication error.
3. **Frontend Auto‑Logout on 401**
   - In the global API client (`frontend/src/utils/api.ts`), intercept 401 responses and clear local storage token, redirecting the user to the login page.
4. **Configuration**
   - Add `JWT_EXPIRES_IN` env variable (e.g., `24h`) and document it.

---

## Open Questions

> [!IMPORTANT] **Telegram Bot Token**: Do you already have a Telegram bot token, or should we generate a new one? If you have one, please add it to `backend/.env` as `TELEGRAM_BOT_TOKEN`.

> [!IMPORTANT] **Default Admin Chat IDs**: Should existing admin users be pre‑populated with a placeholder chat ID, or leave them empty for manual entry?

> [!IMPORTANT] **Logo Storage**: Preferred directory for major logo uploads (e.g., `public/logos/majors/`)?

> [!IMPORTANT] **Remaining Seats Feature**: Confirm if the "Show remaining seats" flag should be globally enabled/disabled or per‑major.

## Verification Plan (Extended)

### Automated Tests
- Add unit tests for the new Telegram notification service (mock HTTP request to Bot API).
- Add integration tests for the registration field config endpoint.
- Verify JWT expiration handling with token expiry simulation.

### Manual Verification
- Log in as admin, verify a Telegram message is received.
- Edit a registration field via **Kelola UI/Data** and confirm the wizard reflects changes.
- Upload a major logo and ensure it appears on the registration page.
- Attempt to use an expired JWT (set system clock ahead) and confirm auto‑logout.

**User Review Required**
- Please confirm the above approach, especially the handling of Telegram chat IDs and logo storage path.

