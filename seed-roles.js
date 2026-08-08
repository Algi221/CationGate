const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL || 'https://hpnnzjpskvqwmbkcxfnm.supabase.co';
const supabaseKey = process.env.SUPABASE_SECRET_KEY || 'sb_secret_darPoHTkh_9GGLe0FmVMbQ_PlIt6C4g';
const supabase = createClient(supabaseUrl, supabaseKey);

async function initUsers() {
  console.log('Memulai inisialisasi ulang test users...');
  const hash = bcrypt.hashSync('admin123', 10);
  
  // Ambil school id asli
  const { data: schools } = await supabase.from('schools').select('id').eq('slug', 'smktarunabhakti').limit(1);
  const schoolId = schools && schools.length > 0 ? schools[0].id : null;
  if (!schoolId) {
    console.error('School SMK Taruna Bhakti tidak ditemukan!');
    return;
  }
  
  console.log('School ID:', schoolId);

  // 1. Gatekeeper User
  console.log('1. Membuat akun Gatekeeper...');
  await supabase.from('gatekeeper_users').delete().eq('username', 'gatekeeper_test');
  const r1 = await supabase.from('gatekeeper_users').insert({
    id: 9999, // Bypass sequence error
    username: 'gatekeeper_test',
    password_hash: hash,
    nama_lengkap: 'Gatekeeper CationGate',
    email: 'gatekeeper@cationgate.id',
    role: 'gatekeeper'
  });
  if (r1.error) console.error('Error Gatekeeper:', r1.error);

  // 2. Superadmin Sekolah
  console.log('2. Membuat akun Superadmin Sekolah...');
  await supabase.from('admin_users').delete().eq('username', 'superadmin_sekolah');
  const r2 = await supabase.from('admin_users').insert({
    id: 10001, // Bypass sequence error
    school_id: schoolId,
    username: 'superadmin_sekolah',
    password_hash: hash,
    nama_lengkap: 'Kepala Sekolah (Superadmin)',
    role: 'superadmin'
  });
  if (r2.error) console.error('Error Superadmin:', r2.error);

  // 3. Admin Sekolah
  console.log('3. Membuat akun Admin Sekolah...');
  await supabase.from('admin_users').delete().eq('username', 'admin_sekolah');
  const r3 = await supabase.from('admin_users').insert({
    id: 10002, // Bypass sequence error
    school_id: schoolId,
    username: 'admin_sekolah',
    password_hash: hash,
    nama_lengkap: 'Tenaga Pendidik (Admin)',
    role: 'admin'
  });
  if (r3.error) console.error('Error Admin:', r3.error);

  // 4. Siswa yang mendaftar
  console.log('4. Membuat data dummy Calon Siswa...');
  await supabase.from('calon_siswa').delete().eq('nisn', '1234567890');
  const r4 = await supabase.from('calon_siswa').insert({
    id: 10003, // Bypass sequence error
    school_id: schoolId,
    nama: 'Budi Calon Siswa',
    nisn: '1234567890',
    nik: '3276012345678901',
    tempat_lahir: 'Depok',
    tgl_lahir: '2010-01-01',
    jenis_kelamin: 'L',
    agama: 'Islam',
    alamat: 'Jl. Merdeka No.1',
    rt_rw: '01/01',
    kelurahan: 'Mekarjaya',
    kecamatan: 'Sukmajaya',
    kode_pos: '16411',
    whatsapp: '081234567890',
    email: 'budi@siswa.com',
    tinggal_dengan: 'Orang Tua',
    transportasi: 'Kendaraan Pribadi',
    tinggi_badan: 160,
    berat_badan: 50,
    jarak_sekolah: 'Kurang dari 1 km',
    jarak_km: 0.5,
    waktu_jam: 0,
    waktu_menit: 10,
    jumlah_saudara: 2,
    golongan_darah: 'O',
    telepon_ortu: '081298765432',
    sekolah_asal: 'SMPN 1 Depok',
    tgl_lulus: '2025-06-01',
    jurusan_1: 'PPLG'
  });
  if (r4.error) console.error('Error Siswa:', r4.error);

  console.log('Selesai.');
}

initUsers().catch(console.error);
