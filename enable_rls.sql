-- ==============================================================================
-- CATIONGATE - ENABLE ROW LEVEL SECURITY (RLS) FOR ALL PUBLIC TABLES
-- ==============================================================================
-- Jalankan query ini di Supabase SQL Editor untuk menyelesaikan peringatan Security Advisor.

-- 1. Security Critical / Sensitive Tables
ALTER TABLE IF EXISTS public.verification_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.school_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.prospective_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.gatekeeper_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.plans ENABLE ROW LEVEL SECURITY;

-- 2. Core Tenant & Admin Tables
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.calon_siswa ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.siswa_aktif ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.active_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_applicants ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.mutasi_history ENABLE ROW LEVEL SECURITY;

-- 3. Content & Config Tables
ALTER TABLE IF EXISTS public.informasi ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.landing_page_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.ui_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.school_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.school_announcements ENABLE ROW LEVEL SECURITY;
