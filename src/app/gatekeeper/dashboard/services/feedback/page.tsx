"use client";

import React, { useState } from "react";
import {
  MessageSquare, Send, Search, Building2, Tag, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

interface FeedbackReport {
  id: number;
  school_name: string;
  admin_name: string;
  category: "Feature Request" | "Bug Report" | "Billing Inquiry" | "General Feedback";
  message: string;
  priority: "Urgent" | "Normal" | "Low";
  status: "Open" | "In Progress" | "Resolved";
  created_at: string;
  reply?: string;
}

export default function GatekeeperFeedbackPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedTicket, setSelectedTicket] = useState<FeedbackReport | null>(null);
  const [replyText, setReplyText] = useState("");

  const [feedbacks, setFeedbacks] = useState<FeedbackReport[]>([
    {
      id: 1,
      school_name: "SMK Putra Bangsa",
      admin_name: "Bambang Sudirman",
      category: "Bug Report",
      message: "Formulir pendaftaran jalur prestasi foto Base64 belum muncul otomatis di pratinjau kartu peserta.",
      priority: "Urgent",
      status: "In Progress",
      created_at: "2026-07-29 14:20",
    },
    {
      id: 2,
      school_name: "SMK Taruna Bhakti",
      admin_name: "Admin TB",
      category: "Feature Request",
      message: "Mohon ditambahkan opsi integrasi Gateway Pembayaran DANA & OVO di tab konfigurasi rekening bank.",
      priority: "Normal",
      status: "Open",
      created_at: "2026-07-30 09:15",
    },
    {
      id: 3,
      school_name: "SMA Global Mandiri",
      admin_name: "Dr. Rina Wulandari",
      category: "Billing Inquiry",
      message: "Bagaimana cara melakukan upgrade dari paket Pro ke Enterprise sebelum periode PPDB Gelombang 2 berakhir?",
      priority: "Low",
      status: "Resolved",
      created_at: "2026-07-25 11:45",
      reply: "Tim billing CationGate telah menghubungi email resmi sekolah Anda untuk mengaktifkan paket Enterprise."
    },
  ]);

  const handleSendReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    setFeedbacks(prev =>
      prev.map(f =>
        f.id === selectedTicket.id
          ? { ...f, status: "Resolved", reply: replyText.trim() }
          : f
      )
    );

    Swal.fire({
      title: "Balasan Terkirim!",
      text: `Balasan Anda telah dikirim ke Admin Sekolah ${selectedTicket.school_name}.`,
      icon: "success",
      confirmButtonColor: "#2563EB",
      customClass: { popup: "rounded-2xl dark:bg-slate-900 dark:text-white" }
    });

    setReplyText("");
    setSelectedTicket(null);
  };

  const filteredFeedbacks = feedbacks.filter(f => {
    const matchesSearch = f.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          f.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "ALL" || f.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Feedback & Laporan Masukan Admin Sekolah
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola masukan, laporan bug, dan permohonan bantuan dari Administrator Sekolah CationGate.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 font-mono px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Total Tiket: {feedbacks.length}
          </span>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <Input
            type="text"
            placeholder="Cari sekolah atau isi masukan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { label: "Semua Kategori", value: "ALL" },
            { label: "Bug Report", value: "Bug Report" },
            { label: "Feature Request", value: "Feature Request" },
            { label: "Billing Inquiry", value: "Billing Inquiry" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeedbacks.map((fb) => (
          <div
            key={fb.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{fb.school_name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  fb.priority === "Urgent"
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-blue-50 text-blue-600 border border-blue-200"
                }`}>
                  {fb.priority}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-700 dark:text-slate-300">{fb.category}</span>
                <span>• {fb.created_at}</span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                &quot;{fb.message}&quot;
              </p>

              {fb.reply && (
                <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-blue-950 dark:text-blue-200 space-y-1">
                  <p className="font-bold flex items-center gap-1 text-[11px] text-blue-600">
                    <ShieldCheck className="w-3.5 h-3.5" /> Balasan Gatekeeper:
                  </p>
                  <p className="leading-relaxed">{fb.reply}</p>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                fb.status === "Resolved"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : "bg-amber-50 text-amber-600 border border-amber-200"
              }`}>
                {fb.status}
              </span>

              <Button
                onClick={() => setSelectedTicket(fb)}
                className="h-8 px-3 text-xs rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
              >
                <Send className="w-3.5 h-3.5 mr-1" /> Balas Tiket
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Balas Tiket */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">Balas Tiket {selectedTicket.school_name}</h3>
            <p className="text-xs text-slate-500">Pesan dari admin: &quot;{selectedTicket.message}&quot;</p>

            <textarea
              rows={4}
              placeholder="Tulis balasan penjelasan atau solusi teknis untuk admin sekolah..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setSelectedTicket(null)} className="h-9 px-4 text-xs rounded-xl">
                Batal
              </Button>
              <Button onClick={handleSendReply} className="h-9 px-4 text-xs rounded-xl bg-blue-600 text-white font-bold">
                Kirim Balasan
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
