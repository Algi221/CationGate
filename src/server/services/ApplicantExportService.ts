import ExcelJS from 'exceljs';
import { getSupabaseClient } from '../db/supabase';

export class ApplicantExportService {
  static async exportToExcel(schoolId: string | null, authToken?: string): Promise<{ buffer: ExcelJS.Buffer; filename: string }> {
    const supabase = getSupabaseClient(authToken);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data Calon Siswa');

    worksheet.columns = [
      { header: 'No. Pendaftaran', key: 'registration_no', width: 20 },
      { header: 'Nama Lengkap', key: 'nama', width: 30 },
      { header: 'NISN', key: 'nisn', width: 15 },
      { header: 'NIK', key: 'nik', width: 20 },
      { header: 'Jenis Kelamin', key: 'jenis_kelamin', width: 15 },
      { header: 'Sekolah Asal', key: 'sekolah_asal', width: 25 },
      { header: 'Program Keahlian (Jurusan)', key: 'jurusan_1', width: 30 },
      { header: 'No. WhatsApp', key: 'whatsapp', width: 18 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Status Seleksi', key: 'status', width: 15 },
      { header: 'Verifikasi Berkas Fisik', key: 'physical_doc_verified', width: 22 },
      { header: 'Diverifikasi Oleh', key: 'physical_doc_verified_by', width: 20 },
      { header: 'Tanggal Daftar', key: 'tgl_daftar', width: 20 }
    ];

    worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '1E3A8A' }
    };

    let exportQuery = supabase.from('student_applicants').select('*')
      .is('deleted_at', null)
      .order('tgl_daftar', { ascending: false });

    if (schoolId) exportQuery = exportQuery.eq('school_id', schoolId);

    const { data: rows, error } = await exportQuery;
    if (error) throw error;

    (rows || []).forEach((row: Record<string, unknown>) => {
      worksheet.addRow({
        registration_no: row.registration_no || '-',
        nama: row.nama || '-',
        nisn: row.nisn || '-',
        nik: row.nik || '-',
        jenis_kelamin: row.jenis_kelamin === 'L' ? 'Laki-laki' : row.jenis_kelamin === 'P' ? 'Perempuan' : row.jenis_kelamin,
        sekolah_asal: row.sekolah_asal || '-',
        jurusan_1: row.jurusan_1 || '-',
        whatsapp: row.whatsapp || '-',
        email: row.email || '-',
        status: row.status || 'Pending',
        physical_doc_verified: row.physical_doc_verified ? 'Sudah Diterima' : 'Belum Diterima',
        physical_doc_verified_by: row.physical_doc_verified_by || '-',
        tgl_daftar: row.tgl_daftar ? new Date(row.tgl_daftar as string).toLocaleString('id-ID') : '-'
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `Data-Calon-Siswa-${new Date().toISOString().split('T')[0]}.xlsx`;

    return { buffer, filename };
  }
}
