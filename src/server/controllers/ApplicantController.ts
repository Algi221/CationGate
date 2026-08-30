import { Context } from "hono";
import { requireTenantId } from "../middleware/auth";
import { ApplicantService } from "../services/ApplicantService";
import { ApplicantExportService } from "../services/ApplicantExportService";

export class ApplicantController {
  static async register(c: Context) {
    try {
      const body = await c.req.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const schoolSlug = c.req.query('school_slug') || (body as any).school_slug;
      const result = await ApplicantService.registerApplicant(body, schoolSlug);
      return c.json(result, result.statusCode);
    } catch (err: unknown) {
      console.error('Registration API error:', err);
      return c.json({ success: false, message: 'Gagal memproses formulir pendaftaran: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async getAll(c: Context) {
    try {
      const schoolIdOrSlug = c.req.query("school_slug") || c.req.query("school_id");
      const authToken = c.req.header("Authorization");
      const result = await ApplicantService.getPublicApplicants(schoolIdOrSlug, authToken);
      return c.json(result);
    } catch (err: unknown) {
      console.error("ApplicantController.getAll Error:", err);
      return c.json({ success: false, message: "Gagal mengambil data pendaftar" }, 500);
    }
  }

  static async getAdminList(c: Context) {
    try {
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');
      const rows = await ApplicantService.getAdminApplicants(schoolId, authToken);
      return c.json({ success: true, data: rows });
    } catch (err: unknown) {
      console.warn('Fetch applicants list error / unauthenticated:', (err as Error)?.message || err);
      return c.json({ success: false, message: 'Gagal mengambil data pendaftar', data: [] }, 401);
    }
  }

  static async getTrashed(c: Context) {
    try {
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');
      const rows = await ApplicantService.getTrashedApplicants(schoolId, authToken);
      return c.json({ success: true, data: rows });
    } catch (err: unknown) {
      console.error('Fetch trashed applicants list error:', err);
      return c.json({ success: false, message: 'Gagal mengambil data pendaftar terhapus: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async exportExcel(c: Context) {
    try {
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');
      const { buffer, filename } = await ApplicantExportService.exportToExcel(schoolId, authToken);

      return new Response(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      });
    } catch (err: unknown) {
      console.error('Export Excel error:', err);
      return c.json({ success: false, message: 'Gagal mengekspor data: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async restore(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const updated = await ApplicantService.restoreApplicant(id, schoolId, authToken);
      if (!updated) {
        return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
      }
      return c.json({ success: true, message: 'Data calon siswa berhasil dipulihkan.', data: updated });
    } catch (err: unknown) {
      console.error('Restore applicant error:', err);
      return c.json({ success: false, message: 'Gagal memulihkan data pendaftar: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async getDetail(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const applicant = await ApplicantService.getApplicantById(id, schoolId, authToken);
      if (!applicant) {
        return c.json({ success: false, message: 'Calon siswa tidak ditemukan.' }, 404);
      }
      return c.json({ success: true, data: applicant });
    } catch (err) {
      console.error('Get applicant detail error:', err);
      return c.json({ success: false, message: 'Gagal mengambil detail pendaftar.' }, 500);
    }
  }

  static async update(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const body = await c.req.json();
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const result = await ApplicantService.updateApplicant(id, schoolId, body, authToken);
      return c.json(result, result.statusCode);
    } catch (err: unknown) {
      console.error('Update applicant error:', err);
      return c.json({ success: false, message: 'Gagal memperbarui data pendaftar: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async updateStatus(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const { status, alasan_ditolak } = await c.req.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = c.get('admin') as any;
      const adminName = admin ? (admin.nama || admin.username) : 'Sistem';
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const result = await ApplicantService.updateApplicantStatus(id, schoolId, status, alasan_ditolak, adminName, authToken);
      return c.json(result, result.statusCode);
    } catch (err) {
      console.error('Update status error:', err);
      return c.json({ success: false, message: 'Gagal memperbarui status pendaftar.' }, 500);
    }
  }

  static async delete(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const permanent = c.req.query('permanent') === 'true';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = (c as any).get('admin');
      const adminName = admin ? (admin.nama || admin.username) : 'Sistem';
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const result = await ApplicantService.deleteApplicant(id, schoolId, permanent, adminName, authToken);
      return c.json(result);
    } catch (err: unknown) {
      console.error('Delete applicant error:', err);
      return c.json({ success: false, message: 'Gagal menghapus data pendaftar: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async verifyPhysicalDoc(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const { verified, checklist } = await c.req.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const admin = c.get('admin') as any;
      const adminName = admin ? (admin.nama || admin.username) : 'Admin';
      const schoolId = await requireTenantId(c);
      const authToken = c.req.header('Authorization');

      const updatedRecord = await ApplicantService.verifyPhysicalDoc(id, schoolId, verified, checklist, adminName, authToken);
      return c.json({ success: true, message: 'Status verifikasi berkas fisik berhasil diperbarui.', data: updatedRecord });
    } catch (err: unknown) {
      console.error('Update physical doc status error:', err);
      return c.json({ success: false, message: 'Gagal memperbarui status verifikasi berkas fisik: ' + ((err as Error)?.message || String(err)) }, 500);
    }
  }

  static async getRegistrationCard(c: Context) {
    try {
      const nisn = c.req.param('nisn');
      const schoolSlug = c.req.query('school_slug');
      const record = await ApplicantService.getRegistrationCard(nisn, schoolSlug);
      if (!record) {
        return c.json({ success: false, message: 'Pendaftar tidak ditemukan.' }, 404);
      }
      return c.json({ success: true, data: record });
    } catch (err) {
      console.error('Fetch registration card error:', err);
      return c.json({ success: false, message: 'Gagal mengambil data kartu pendaftaran.' }, 500);
    }
  }

  static async getPublicInvoice(c: Context) {
    try {
      const nisn = c.req.param('nisn');
      const schoolSlug = c.req.query('school_slug');
      const record = await ApplicantService.getPublicInvoice(nisn, schoolSlug);
      if (!record) {
        return c.json({ success: false, message: 'Data invoice pendaftar tidak ditemukan.' }, 404);
      }
      return c.json({ success: true, data: record });
    } catch (err) {
      console.error('Fetch public invoice error:', err);
      return c.json({ success: false, message: 'Gagal mengambil data invoice pendaftar.' }, 500);
    }
  }

  static async verifyIdentity(c: Context) {
    try {
      const id = parseInt(c.req.param('id') || '0');
      const { nik } = await c.req.json();
      const schoolSlug = c.req.query('school_slug');

      const applicant = await ApplicantService.verifyApplicantIdentity(id, nik, schoolSlug || '');
      if (applicant && 'notFoundSchool' in applicant) {
        return c.json({ success: false, message: 'Sekolah tidak ditemukan.' }, 404);
      }
      if (!applicant) {
        return c.json({ success: false, message: 'Data pendaftar tidak ditemukan atau NIK tidak sesuai.' }, 404);
      }
      return c.json({ success: true, data: applicant });
    } catch (_err: unknown) {
      return c.json({ success: false, message: 'Kesalahan server verifikasi.' }, 500);
    }
  }
}
