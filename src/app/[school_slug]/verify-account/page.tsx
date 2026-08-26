"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, CheckCircle2, ShieldCheck, Mail, Building2, Send, AlertCircle } from "lucide-react";
import { useSchoolHref } from "@/hooks/useSchoolHref";

type VerifyStep = 'form' | 'otp' | 'pending' | 'done';

export default function VerifyAccountPage() {
  const params = useParams();
  const router = useRouter();
  const schoolSlug = params.school_slug as string;
  const { href } = useSchoolHref();

  const [step, setStep] = useState<VerifyStep>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [_schoolStatus, setSchoolStatus] = useState('');
  const [schoolId, setSchoolId] = useState('');

  const [formData, setFormData] = useState({
    npsn: '',
    dapodik_code: '',
    official_email: '',
    instagram_url: '',
    linkedin_url: '',
    website_url: '',
  });

  const [otpCode, setOtpCode] = useState('');

  useEffect(() => {
    async function fetchSchool() {
      try {
        const res = await fetch(`/api/saas/school-by-slug/${schoolSlug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setSchoolId(data.data.id);
          setSchoolStatus(data.data.status);

          if (data.data.status === 'verified') {
            setStep('done');
          } else if (data.data.status === 'pending_review') {
            setStep('pending');
          } else if (data.data.status === 'otp_verified') {
            setStep('pending');
          }

          // Pre-fill if data exists
          if (data.data.npsn) setFormData(prev => ({ ...prev, npsn: data.data.npsn }));
          if (data.data.official_email) setFormData(prev => ({ ...prev, official_email: data.data.official_email }));
          if (data.data.social_media) {
            const sm = data.data.social_media;
            setFormData(prev => ({
              ...prev,
              instagram_url: sm.instagram || '',
              linkedin_url: sm.linkedin || '',
              website_url: sm.website || '',
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSchool();
  }, [schoolSlug]);

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.npsn || !formData.dapodik_code || !formData.official_email) {
      setError('NPSN, Kode Dapodik, dan Email Resmi wajib diisi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify/submit-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: schoolId,
          ...formData
        })
      });
      const data = await res.json();

      if (data.success) {
        setStep('otp');
      } else {
        setError(data.message || 'Gagal menyimpan data verifikasi');
      }
    } catch (_err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otpCode || otpCode.length < 6) {
      setError('Masukkan kode OTP 6 digit yang dikirim ke email resmi Anda.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/verify/check-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          school_id: schoolId,
          otp_code: otpCode
        })
      });
      const data = await res.json();

      if (data.success) {
        setStep('pending');
      } else {
        setError(data.message || 'Kode OTP tidak valid atau sudah kedaluwarsa.');
      }
    } catch (_err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/verify/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId, email: formData.official_email })
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.message || 'Gagal mengirim ulang OTP');
      }
    } catch (_err) {
      setError('Gagal mengirim ulang kode OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] font-sans flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-9 h-9 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-sm">
            CG
          </div>
          <span className="text-xl font-bold tracking-tight text-zinc-900">CationGate</span>
        </div>

        {/* Form Step: Verification Data */}
        {step === 'form' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="w-6 h-6 text-zinc-900" />
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Verifikasi Instansi</h1>
            </div>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Untuk mengaktifkan fitur-fitur utama, lengkapi data legalitas sekolah Anda. Data ini akan diverifikasi oleh tim CationGate.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 text-sm text-red-600 font-medium flex items-start gap-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmitVerification} className="space-y-5">
              {/* Section: Legalitas */}
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 mb-1">
                <Building2 className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Legalitas Instansi</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="npsn" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">NPSN</Label>
                  <Input
                    id="npsn"
                    value={formData.npsn}
                    onChange={e => setFormData({ ...formData, npsn: e.target.value })}
                    placeholder="20012345"
                    className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dapodik_code" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">Kode Dapodik</Label>
                  <Input
                    id="dapodik_code"
                    value={formData.dapodik_code}
                    onChange={e => setFormData({ ...formData, dapodik_code: e.target.value })}
                    placeholder="123456"
                    className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="official_email" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">Email Resmi Sekolah</Label>
                <Input
                  id="official_email"
                  type="email"
                  value={formData.official_email}
                  onChange={e => setFormData({ ...formData, official_email: e.target.value })}
                  placeholder="humas@smktarunabhakti.sch.id"
                  className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                />
                <p className="text-[11px] text-zinc-400">Kode OTP akan dikirim ke email ini untuk verifikasi kepemilikan.</p>
              </div>

              {/* Section: Social Media */}
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 mb-1 mt-8">
                <Mail className="w-4 h-4 text-zinc-400" />
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Social Media & Website</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">Instagram</Label>
                  <Input
                    id="instagram_url"
                    value={formData.instagram_url}
                    onChange={e => setFormData({ ...formData, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/smktarunabhakti"
                    className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedin_url" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">LinkedIn</Label>
                    <Input
                      id="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={e => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://linkedin.com/..."
                      className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website_url" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">Website</Label>
                    <Input
                      id="website_url"
                      value={formData.website_url}
                      onChange={e => setFormData({ ...formData, website_url: e.target.value })}
                      placeholder="https://smktb.sch.id"
                      className="h-12 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm placeholder:text-zinc-400"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-sm font-medium" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? 'Menyimpan...' : 'Kirim & Verifikasi Email'}
                  {!loading && <Send className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="w-14 h-14 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-6">
              <Mail className="w-7 h-7 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-2">Verifikasi Email</h1>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Kode OTP 6 digit telah dikirim ke <strong className="text-zinc-700">{formData.official_email}</strong>. Masukkan kode tersebut di bawah ini.
            </p>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-50/50 border border-red-100 text-sm text-red-600 font-medium flex items-start gap-3">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-zinc-500 text-[11px] font-semibold uppercase tracking-widest">Kode OTP</Label>
                <Input
                  id="otp"
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="h-14 rounded-xl border-zinc-200 focus-visible:ring-1 focus-visible:ring-zinc-950 focus-visible:border-zinc-950 transition-all bg-white dark:bg-[#0f172a] shadow-sm text-center text-2xl font-mono tracking-[0.5em] placeholder:text-zinc-300 placeholder:tracking-[0.5em]"
                />
              </div>

              <Button onClick={handleVerifyOTP} className="w-full h-12 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white transition-all shadow-sm font-medium" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Memverifikasi...' : 'Verifikasi Kode'}
              </Button>

              <div className="text-center">
                <button type="button" onClick={handleResendOTP} disabled={loading} className="text-xs text-zinc-500 hover:text-zinc-900 underline underline-offset-4 transition-colors font-medium">
                  Kirim ulang kode OTP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pending Review Step */}
        {step === 'pending' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-3">Menunggu Persetujuan</h1>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-8">
              Email resmi Anda telah terverifikasi. Data legalitas sekolah sedang ditinjau oleh tim CationGate. Anda akan mendapat notifikasi setelah akun disetujui.
            </p>

            <div className="bg-zinc-50 rounded-xl p-5 border border-zinc-100 max-w-sm mx-auto">
              <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-2">Status Saat Ini</p>
              <div className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <p className="text-sm font-medium text-zinc-700">Menunggu Review Admin</p>
              </div>
            </div>

            <Button onClick={() => router.push('/login')} variant="outline" className="mt-8 rounded-xl border-zinc-200 h-12 px-8 font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all">
              Kembali ke Login
            </Button>
          </div>
        )}

        {/* Done Step */}
        {step === 'done' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center">
            <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-zinc-900" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 mb-3">Instansi Terverifikasi</h1>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-sm mx-auto mb-8">
              Selamat! Instansi Anda telah terverifikasi sepenuhnya. Anda dapat mengakses semua fitur di dashboard.
            </p>
            <Button onClick={() => router.push(href("/dashboard"))} className="rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white h-12 px-8 font-medium transition-all">
              Buka Dashboard <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
