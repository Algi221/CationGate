"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { CheckCircle2, ArrowRight, Loader2, Building, User, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DaftarSaaS() {
  const [formData, setFormData] = useState({
    school_name: '', slug: '', email: '', phone: '', address: '',
    admin_name: '', admin_username: '', admin_password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [successData, setSuccessData] = useState<{slug: string, school_id: string} | null>(null);

  // Auto-generate slug from school name
  useEffect(() => {
    if (step === 1 && formData.school_name) {
      const generated = formData.school_name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (formData.slug !== generated) {
        setFormData(prev => ({...prev, slug: generated}));
      }
    }
  }, [formData.school_name, step]);

  const handleNext = () => {
    if (step === 1) {
      if (!formData.school_name || !formData.slug || !formData.email || !formData.phone) {
        setErrorMsg("Harap lengkapi semua data instansi");
        return;
      }
    }
    setErrorMsg("");
    setStep(2);
  };

  const handleActivate = async (schoolId: string, slug: string) => {
    try {
      await fetch('/api/saas/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ school_id: schoolId })
      });
      setSuccessData({ slug, school_id: schoolId });
      setStep(3);
    } catch (err) {
      console.error(err);
      setErrorMsg("Gagal mengaktifkan layanan setelah pembayaran.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.admin_name || !formData.admin_username || !formData.admin_password) {
      setErrorMsg("Harap lengkapi data administrator");
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    
    try {
      const res = await fetch('/api/saas/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success && data.token) {
        // Trigger Midtrans Snap
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: function(result: any) {
            handleActivate(data.school_id, formData.slug);
          },
          onPending: function(result: any) {
            setErrorMsg("Menunggu pembayaran...");
            setLoading(false);
          },
          onError: function(result: any) {
            setErrorMsg("Pembayaran gagal!");
            setLoading(false);
          },
          onClose: function() {
            setErrorMsg("Anda menutup popup pembayaran sebelum menyelesaikannya.");
            setLoading(false);
          }
        });
      } else {
        setErrorMsg(data.message || "Gagal mendaftar");
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg("Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="beforeInteractive"
      />

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            CG
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">CationGate</span>
        </Link>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          {step === 1 && "Detail Instansi"}
          {step === 2 && "Akun Administrator"}
          {step === 3 && "Pendaftaran Berhasil"}
        </h2>
        <p className="mt-2 text-center text-sm text-slate-500">
          {step === 1 && "Langkah 1 dari 2"}
          {step === 2 && "Langkah 2 dari 2"}
          {step === 3 && "Sistem Anda siap digunakan!"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-200 shadow-sm">
          {step === 3 && successData ? (
            <CardContent className="pt-10 pb-10 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                Terima kasih telah berlangganan. Sistem pendaftaran untuk instansi Anda telah aktif dan siap digunakan.
              </p>
              
              <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8 max-w-sm mx-auto flex items-center justify-between">
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">URL Instansi</p>
                  <p className="font-mono text-sm font-medium text-slate-900">cationgate.com/{successData.slug}</p>
                </div>
              </div>

              <Link href={`/${successData.slug}/auth/login`}>
                <Button size="lg" className="rounded-full shadow-sm">
                  Masuk ke Dashboard Admin <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </CardContent>
          ) : (
            <CardContent className="pt-8">
              {errorMsg && (
                <div className="mb-6 p-4 rounded-md bg-rose-50 border border-rose-200 text-sm text-rose-600 font-medium flex items-start gap-2">
                  <Info className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                      <Building className="w-4 h-4 text-slate-400" />
                      <h3 className="font-medium text-slate-900">Informasi Sekolah</h3>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="school_name">Nama Sekolah / Instansi</Label>
                      <Input 
                        id="school_name"
                        value={formData.school_name} 
                        onChange={e => setFormData({...formData, school_name: e.target.value})} 
                        placeholder="Contoh: SMK Taruna Bhakti" 
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="slug">URL / Subdomain Custom</Label>
                      <div className="flex">
                        <div className="flex items-center px-3 border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm rounded-l-md font-mono">
                          cationgate.com/
                        </div>
                        <Input 
                          id="slug"
                          value={formData.slug} 
                          onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})} 
                          className="rounded-l-none font-mono"
                          placeholder="smktarunabhakti" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email Resmi</Label>
                        <Input 
                          id="email" type="email"
                          value={formData.email} 
                          onChange={e => setFormData({...formData, email: e.target.value})} 
                          placeholder="info@sekolah.sch.id" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">No. Telepon / WhatsApp</Label>
                        <Input 
                          id="phone"
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          placeholder="08123456789" 
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="address">Alamat Lengkap</Label>
                      <Input 
                        id="address"
                        value={formData.address} 
                        onChange={e => setFormData({...formData, address: e.target.value})} 
                        placeholder="Jalan Pekapuran Raya No..." 
                      />
                    </div>
                    
                    <Button type="submit" className="w-full mt-2">
                      Lanjutkan <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
                      <User className="w-4 h-4 text-slate-400" />
                      <h3 className="font-medium text-slate-900">Administrator Utama</h3>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="admin_name">Nama Lengkap Admin</Label>
                      <Input 
                        id="admin_name"
                        value={formData.admin_name} 
                        onChange={e => setFormData({...formData, admin_name: e.target.value})} 
                        placeholder="Budi Santoso" 
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="admin_username">Username</Label>
                        <Input 
                          id="admin_username"
                          value={formData.admin_username} 
                          onChange={e => setFormData({...formData, admin_username: e.target.value})} 
                          placeholder="admin_ppdb" 
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="admin_password">Password</Label>
                        <Input 
                          id="admin_password" type="password"
                          value={formData.admin_password} 
                          onChange={e => setFormData({...formData, admin_password: e.target.value})} 
                          placeholder="••••••••" 
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-center justify-between my-6">
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Total Pembayaran</p>
                        <p className="text-xs text-blue-700">Paket Institusi Tahunan</p>
                      </div>
                      <p className="text-lg font-bold text-blue-900">Rp 750.000</p>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="w-1/3" onClick={() => setStep(1)} disabled={loading}>
                        Kembali
                      </Button>
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {loading ? "Memproses..." : "Bayar & Aktifkan"}
                      </Button>
                    </div>
                  </div>
                )}
                
              </form>
            </CardContent>
          )}
        </Card>
        
        {step !== 3 && (
          <p className="text-center text-xs text-slate-400 mt-6">
            Dengan mendaftar, Anda menyetujui Syarat & Ketentuan serta Kebijakan Privasi CationGate.
          </p>
        )}
      </div>
    </div>
  );
}
