import { z } from 'zod';
import { registerApplicantSchema } from './applicants';

// Re-use registerApplicantSchema, adapt jurusan field for SiswaAktif, and make all fields optional for update
export const updateSiswaAktifSchema = registerApplicantSchema.omit({
  jurusan1: true
}).extend({
  jurusan: z.string().optional()
}).partial();
