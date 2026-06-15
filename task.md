# Task Checklist: Admin Timeout Modal & Toast Deduplication

- [ ] Deduplikasi Notifikasi Toast
  - [ ] Update `verifyApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
  - [ ] Update `rejectApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
  - [ ] Update `deleteApplicant` di `PPDBContext.tsx` (suppress toast jika `wsStatus === "CONNECTED"`)
- [ ] Modifikasi Inactivity Timer
  - [ ] Hapus inactivity timer yang redundant di `PPDBContext.tsx`
  - [ ] Ubah durasi timer di `DashboardLayout` (`layout.tsx`) menjadi 1 jam (`60 * 60 * 1000` md)
  - [ ] Tambahkan state `showTimeoutModal` di `DashboardLayout`
  - [ ] Implementasikan rendering popup modal di `DashboardLayout`
- [ ] Verifikasi & Pengujian
  - [ ] Verifikasi kompilasi frontend (`bun x tsc --noEmit`)
  - [ ] Jalankan Next.js production build (`bun run build`)
  - [ ] Push perubahan terbaru ke GitHub remote
