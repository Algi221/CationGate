# Task Checklist: Admin Timeout Modal & Toast Deduplication

- [x] Deduplikasi Notifikasi Toast
  - [x] Update `verifyApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
  - [x] Update `rejectApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
  - [x] Update `deleteApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
- [x] Modifikasi Inactivity Timer
  - [x] Hapus inactivity timer yang redundant di `PPDBContext.tsx`
  - [x] Ubah durasi timer di `DashboardLayout` (`layout.tsx`) menjadi 1 jam (`60 * 60 * 1000` md)
  - [x] Tambahkan state `showTimeoutModal` di `DashboardLayout`
  - [x] Implementasikan rendering popup modal di `DashboardLayout`
- [x] Verifikasi & Pengujian
  - [x] Verifikasi kompilasi frontend (`bun x tsc --noEmit`)
  - [x] Jalankan Next.js production build (`bun run build`)
  - [x] Push perubahan terbaru ke GitHub remote
