"use client";

import React, { useState } from "react";
import { 
  Palette, 
  Settings, 
  HelpCircle, 
  Check, 
  X, 
  Info,
  Clock,
  RotateCcw,
  FileText,
  Eye,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Database
} from "lucide-react";
import Swal from 'sweetalert2';

import { useKelolaUIState } from "@/components/features/kelola-ui/hooks/useKelolaUIState";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import { HeroTab } from "@/components/features/kelola-ui/tabs/HeroTab";
import { MajorsTab } from "@/components/features/kelola-ui/tabs/MajorsTab";
import { AlurTab } from "@/components/features/kelola-ui/tabs/AlurTab";
import { FormFieldsTab } from "@/components/features/kelola-ui/tabs/FormFieldsTab";
import { BankTab } from "@/components/features/kelola-ui/tabs/BankTab";
import { FaqTab } from "@/components/features/kelola-ui/tabs/FaqTab";
import { PartnersTab } from "@/components/features/kelola-ui/tabs/PartnersTab";
import { RevisionsTab } from "@/components/features/kelola-ui/tabs/RevisionsTab";
import { ConfirmSaveModal } from "@/components/features/kelola-ui/components/ConfirmSaveModal";
import { LivePreviewLandingModal } from "@/components/features/kelola-ui/components/LivePreviewLandingModal";
import { KelolaUITab } from "@/components/features/kelola-ui/types";

export default function KelolaUIPage() {
  const [showLivePreviewModal, setShowLivePreviewModal] = useState(false);
  const {
    router,
    slug,
    activeTab,
    setActiveTab,
    loading,
    saving,
    toast,
    schoolLogo,
    schoolTitle,
    setSchoolTitle,
    heroTitle,
    setHeroTitle,
    heroTitleSub,
    setHeroTitleSub,
    heroSubtitle,
    setHeroSubtitle,
    mapTitle,
    setMapTitle,
    mapUrl,
    setMapUrl,
    phone,
    setPhone,
    email,
    setEmail,
    schoolPeriod,
    setSchoolPeriod,
    address,
    setAddress,
    footerDesc,
    setFooterDesc,
    waGroupUrl,
    setWaGroupUrl,
    waAdmin,
    setWaAdmin,
    gelombangConfig,
    setGelombangConfig,
    g1Error,
    setG1Error,
    g2Error,
    setG2Error,
    majorsList,
    setMajorsList,
    editingMajor,
    setEditingMajor,
    isNewMajor,
    setIsNewMajor,
    dragActiveStates,
    setDragActiveStates,
    handleDragState,
    processMediaFile,
    showToastMsg,
    alurList,
    setAlurList,
    formFee,
    setFormFee,
    formGuideline,
    setFormGuideline,
    fieldsConfigUI,
    setFieldsConfigUI,
    faqList,
    setFaqList,
    faqTitle,
    setFaqTitle,
    faqSubtitle,
    setFaqSubtitle,
    bankConfigList,
    setBankConfigList,
    partnersList,
    setPartnersList,
    revisions,
    handleRestore,
    formatDate,
    showConfirmModal,
    setShowConfirmModal,
    changeDescription,
    setChangeDescription,
    handleSaveAll,
    heroBgImage,
    setHeroBgImage,
    handleHeroBgImageChange,
    isDirty
  } = useKelolaUIState();
  const { href } = useSchoolHref();

  const draftKey = `ppdb_ui_editor_draft_${slug || 'global'}`;
  const hasLocalDraft = typeof window !== "undefined" && Boolean(localStorage.getItem(draftKey));

  const tabNavigationItems: { id: KelolaUITab; label: string; icon: React.ElementType }[] = [
    { id: "hero", label: "General/Umum", icon: FileText },
    { id: "majors", label: "Program Keahlian (Jurusan)", icon: GraduationCap },
    { id: "alur", label: "Alur Pendaftaran", icon: Settings },
    { id: "form", label: "Form & Panduan", icon: Info },
    { id: "bank", label: "Rekening Bank Sekolah", icon: Database },
    { id: "faq", label: "Pertanyaan (FAQ)", icon: HelpCircle },
    { id: "partners", label: "Partner Industri", icon: Briefcase },
    { id: "revisions", label: "Riwayat Perubahan", icon: Clock }
  ];

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl border text-xs font-bold animate-in slide-in-from-bottom duration-300 ${
          toast.type === "success" 
            ? "bg-emerald-50 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900" 
            : toast.type === "error"
            ? "bg-rose-50 dark:bg-rose-950/90 text-rose-600 dark:text-rose-300 border-rose-200 dark:border-rose-900"
            : "bg-indigo-50 dark:bg-indigo-950/90 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900"
        }`}>
          {toast.type === "success" ? <Check size={16} /> : toast.type === "error" ? <X size={16} /> : <Info size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {saving && (
        <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm w-full mx-4">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <div>
              <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Menyimpan Perubahan...</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Menulis riwayat ke database</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Info Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-100 dark:border-blue-900/40 shrink-0">
            <Palette size={22} />
          </div>
          <div>
            <h2 className="text-base font-black uppercase text-slate-800 dark:text-white tracking-wider">Kelola User Interface</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-0.5">
              Edit Semua Foto, Teks, Jurusan, dan Formulir PPDB secara Real-time
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {hasLocalDraft && (
            <button
              onClick={async () => {
                const result = await Swal.fire({
                  title: 'Konfirmasi',
                  text: "Apakah Anda yakin ingin membatalkan semua draf perubahan yang belum disimpan dan memuat ulang data asli dari server?",
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Ya',
                  cancelButtonText: 'Batal'
                });
                if (result.isConfirmed) {
                  localStorage.removeItem(draftKey);
                  window.location.reload();
                }
              }}
              className="px-3 py-2 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="Reset Draf Lokal"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowLivePreviewModal(true)}
            className="px-3.5 py-2 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Pratinjau Draf (Live Preview)"
          >
            <Eye size={14} />
            <span>Pratinjau Draf</span>
          </button>

          <a
            href={href("/")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-white dark:bg-[#0f172a] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Buka Website Publik"
          >
            <ExternalLink size={13} />
            <span>Lihat Web</span>
          </a>

          <button
            disabled={!isDirty || saving}
            onClick={() => setShowConfirmModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isDirty && !saving
                ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-md shadow-blue-500/20"
                : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50 shadow-none border border-slate-200/50 dark:border-slate-700/50"
            }`}
            title={isDirty ? "Simpan Perubahan UI" : "Tidak ada perubahan data untuk disimpan"}
          >
            <Check size={13} />
            <span>Simpan</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800/70 flex flex-wrap gap-1 mb-6 transition-all duration-300">
        {tabNavigationItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              disabled={editingMajor !== null && tab.id !== "majors"}
              onClick={() => {
                setActiveTab(tab.id);
                router.push(`?tab=${tab.id}`);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-all duration-300 border border-transparent rounded-xl ${
                editingMajor !== null && tab.id !== "majors" ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
              } ${
                activeTab === tab.id
                  ? "bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border-slate-200 dark:border-slate-700"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-900/80"
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-colors">
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Memuat Konfigurasi...</span>
          </div>
        ) : (
          <>
            {activeTab === "hero" && (
              <HeroTab
                schoolLogo={schoolLogo}
                schoolTitle={schoolTitle}
                setSchoolTitle={setSchoolTitle}
                heroTitle={heroTitle}
                setHeroTitle={setHeroTitle}
                heroTitleSub={heroTitleSub}
                setHeroTitleSub={setHeroTitleSub}
                heroSubtitle={heroSubtitle}
                setHeroSubtitle={setHeroSubtitle}
                mapTitle={mapTitle}
                setMapTitle={setMapTitle}
                mapUrl={mapUrl}
                setMapUrl={setMapUrl}
                phone={phone}
                setPhone={setPhone}
                email={email}
                setEmail={setEmail}
                schoolPeriod={schoolPeriod}
                setSchoolPeriod={setSchoolPeriod}
                address={address}
                setAddress={setAddress}
                footerDesc={footerDesc}
                setFooterDesc={setFooterDesc}
                waGroupUrl={waGroupUrl}
                setWaGroupUrl={setWaGroupUrl}
                waAdmin={waAdmin}
                setWaAdmin={setWaAdmin}
                gelombangConfig={gelombangConfig}
                setGelombangConfig={setGelombangConfig}
                g1Error={g1Error}
                setG1Error={setG1Error}
                g2Error={g2Error}
                setG2Error={setG2Error}
                heroBgImage={heroBgImage}
                setHeroBgImage={setHeroBgImage}
                handleHeroBgImageChange={handleHeroBgImageChange}
              />
            )}

            {activeTab === "majors" && (
              <MajorsTab
                majorsList={majorsList}
                setMajorsList={setMajorsList}
                editingMajor={editingMajor}
                setEditingMajor={setEditingMajor}
                isNewMajor={isNewMajor}
                setIsNewMajor={setIsNewMajor}
                dragActiveStates={dragActiveStates}
                setDragActiveStates={setDragActiveStates}
                handleDragState={handleDragState}
                processMediaFile={processMediaFile}
                showToastMsg={showToastMsg}
              />
            )}

            {activeTab === "alur" && (
              <AlurTab
                alurList={alurList}
                setAlurList={setAlurList}
              />
            )}

            {activeTab === "form" && (
              <FormFieldsTab
                formFee={formFee}
                setFormFee={setFormFee}
                formGuideline={formGuideline}
                setFormGuideline={setFormGuideline}
                fieldsConfigUI={fieldsConfigUI}
                setFieldsConfigUI={setFieldsConfigUI}
              />
            )}

            {activeTab === "bank" && (
              <BankTab
                bankConfigList={bankConfigList}
                setBankConfigList={setBankConfigList}
              />
            )}

            {activeTab === "faq" && (
              <FaqTab
                faqList={faqList}
                setFaqList={setFaqList}
                faqTitle={faqTitle}
                setFaqTitle={setFaqTitle}
                faqSubtitle={faqSubtitle}
                setFaqSubtitle={setFaqSubtitle}
              />
            )}

            {activeTab === "partners" && (
              <PartnersTab
                partnersList={partnersList}
                setPartnersList={setPartnersList}
              />
            )}

            {activeTab === "revisions" && (
              <RevisionsTab
                revisions={revisions}
                onRestore={handleRestore}
                formatDate={formatDate}
              />
            )}
          </>
        )}
      </div>

      {/* Confirmation & Note Modal */}
      <ConfirmSaveModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleSaveAll}
        changeDescription={changeDescription}
        onChangeDescription={setChangeDescription}
      />

      {/* Live Preview Modal */}
      <LivePreviewLandingModal
        isOpen={showLivePreviewModal}
        onClose={() => setShowLivePreviewModal(false)}
        onConfirmSave={() => setShowConfirmModal(true)}
        schoolSlug={slug}
        schoolDisplayName={schoolTitle}
        heroTitle={heroTitle}
        heroTitleSub={heroTitleSub}
        heroSubtitle={heroSubtitle}
        heroBgImage={heroBgImage}
        address={address}
        mapTitle={mapTitle}
        mapUrl={mapUrl}
        waAdmin={waAdmin}
        schoolPeriod={schoolPeriod}
        faqList={faqList}
        faqTitle={faqTitle}
        faqSubtitle={faqSubtitle}
        alurList={alurList}
        majorsList={majorsList}
        partnersList={partnersList}
        gelombangConfig={gelombangConfig}
      />
    </div>
  );
}
