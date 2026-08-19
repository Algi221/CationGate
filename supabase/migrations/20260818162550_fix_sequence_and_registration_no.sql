-- Fix: grant sequence permissions to all Supabase roles
-- Jalankan ini di Supabase SQL Editor

GRANT USAGE, SELECT, UPDATE ON SEQUENCE calon_siswa_id_seq TO anon, authenticated, service_role;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE calon_siswa_id_seq TO postgres;

-- Pastikan kolom registration_no ada di student_applicants (Supabase table name)
ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS registration_no VARCHAR(50);
ALTER TABLE student_applicants ADD COLUMN IF NOT EXISTS physical_docs_checklist JSONB;
