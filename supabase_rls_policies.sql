-- ==============================================================================
-- CATIONGATE - PRODUCTION ROW LEVEL SECURITY (RLS) & MULTI-TENANCY POLICIES
-- ==============================================================================
-- Run this SQL in your Supabase SQL Editor to enforce strict tenant-level isolation
-- at the PostgreSQL database engine level.

-- Helper functions for JWT claims extraction
CREATE OR REPLACE FUNCTION auth.get_jwt_school_id()
RETURNS TEXT AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.school_id', true), ''),
    nullif(current_setting('request.jwt.claim.school_slug', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'school_id')
  );
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION auth.get_jwt_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  );
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION auth.is_platform_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE(
    auth.get_jwt_role() IN ('gatekeeper', 'superadmin') OR
    ((nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'isGatekeeper')::boolean IS TRUE),
    false
  );
$$ LANGUAGE SQL STABLE;

-- ------------------------------------------------------------------------------
-- 1. Table: landing_page_config
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS landing_page_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS landing_page_config FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view landing page configs" ON landing_page_config;
CREATE POLICY "Public can view landing page configs"
  ON landing_page_config FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage their school landing configs" ON landing_page_config;
CREATE POLICY "Admins can manage their school landing configs"
  ON landing_page_config FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

-- ------------------------------------------------------------------------------
-- 2. Table: school_profiles
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS school_profiles FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view verified school profiles" ON school_profiles;
CREATE POLICY "Public can view verified school profiles"
  ON school_profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage their school profile" ON school_profiles;
CREATE POLICY "Admins can manage their school profile"
  ON school_profiles FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

-- ------------------------------------------------------------------------------
-- 3. Table: student_applicants
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS student_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS student_applicants FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit registration" ON student_applicants;
CREATE POLICY "Public can submit registration"
  ON student_applicants FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "School admin can view only own school applicants" ON student_applicants;
CREATE POLICY "School admin can view only own school applicants"
  ON student_applicants FOR SELECT
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

DROP POLICY IF EXISTS "School admin can update only own school applicants" ON student_applicants;
CREATE POLICY "School admin can update only own school applicants"
  ON student_applicants FOR UPDATE
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

DROP POLICY IF EXISTS "School admin can delete only own school applicants" ON student_applicants;
CREATE POLICY "School admin can delete only own school applicants"
  ON student_applicants FOR DELETE
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

-- ------------------------------------------------------------------------------
-- 4. Table: active_students
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS active_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS active_students FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "School admin can manage only own active students" ON active_students;
CREATE POLICY "School admin can manage only own active students"
  ON active_students FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

-- ------------------------------------------------------------------------------
-- 5. Table: admin_users
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS admin_users FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Superadmins and school admins can manage their admins" ON admin_users;
CREATE POLICY "Superadmins and school admins can manage their admins"
  ON admin_users FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    (school_id IS NOT NULL AND school_id::text = auth.get_jwt_school_id())
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    (school_id IS NOT NULL AND school_id::text = auth.get_jwt_school_id())
  );

-- ------------------------------------------------------------------------------
-- 6. Table: school_announcements & informasi
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS school_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS school_announcements FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view announcements" ON school_announcements;
CREATE POLICY "Public can view announcements"
  ON school_announcements FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admins can manage school announcements" ON school_announcements;
CREATE POLICY "Admins can manage school announcements"
  ON school_announcements FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );

-- ------------------------------------------------------------------------------
-- 7. Table: ui_revisions
-- ------------------------------------------------------------------------------
ALTER TABLE IF EXISTS ui_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS ui_revisions FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view and create revisions for their school" ON ui_revisions;
CREATE POLICY "Admins can view and create revisions for their school"
  ON ui_revisions FOR ALL
  TO authenticated
  USING (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  )
  WITH CHECK (
    auth.is_platform_admin() OR
    school_id::text = auth.get_jwt_school_id()
  );
