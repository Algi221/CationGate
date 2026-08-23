import { z } from 'zod';
import { registerApplicantSchema } from './applicants';

export const updateSiswaAktifSchema = registerApplicantSchema.omit({
  jurusan1: true
}).extend({
  jurusan: z.string().optional()
}).partial();
