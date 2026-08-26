"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell } from "lucide-react";
import { InformasiItem } from "../types";

interface ForumMiniCalendarProps {
  informasiList: InformasiItem[];
  onSelectDate?: (dateStr: string | null) => void;
  selectedDate?: string | null;
}

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export const ForumMiniCalendar: React.FC<ForumMiniCalendarProps> = ({
  informasiList,
  onSelectDate,
  selectedDate
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // Compute days in month
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: { day: number; isCurrentMonth: boolean; dateStr: string }[] = [];

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = month === 0 ? 11 : month - 1;
      const prevY = month === 0 ? year - 1 : year;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, isCurrentMonth: false, dateStr });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, isCurrentMonth: true, dateStr });
    }

    // Next month padding to fill complete weeks (multiples of 7)
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const nextM = month === 11 ? 0 : month + 1;
      const nextY = month === 11 ? year + 1 : year;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      days.push({ day: i, isCurrentMonth: false, dateStr });
    }

    return days;
  }, [year, month]);

  // Map dates to announcements count
  const eventsByDate = useMemo(() => {
    const map = new Map<string, InformasiItem[]>();
    for (const info of informasiList) {
      if (!info.tanggal) continue;
      const d = new Date(info.tanggal);
      if (isNaN(d.getTime())) continue;
      const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const existing = map.get(dateKey) || [];
      existing.push(info);
      map.set(dateKey, existing);
    }
    return map;
  }, [informasiList]);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }, []);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const upcomingEvents = useMemo(() => {
    return [...informasiList]
      .filter((info) => info.tanggal)
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 3);
  }, [informasiList]);

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col gap-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <CalendarIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
              Agenda & Kalender
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Jadwal & pengumuman resmi
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Bulan Sebelumnya"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 min-w-24 text-center">
            {MONTH_NAMES[month]} {year}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Bulan Berikutnya"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div>
        {/* Day header */}
        <div className="grid grid-cols-7 text-center mb-1">
          {DAY_NAMES.map((d, i) => (
            <span
              key={d}
              className={`text-[10px] font-bold uppercase py-1 ${
                i === 0 ? "text-red-500" : "text-slate-400"
              }`}
            >
              {d}
            </span>
          ))}
        </div>

        {/* Days matrix */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((cell, idx) => {
            const hasEvents = eventsByDate.has(cell.dateStr);
            const isToday = cell.dateStr === todayStr;
            const isSelected = cell.dateStr === selectedDate;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (hasEvents) {
                    onSelectDate?.(isSelected ? null : cell.dateStr);
                  }
                }}
                disabled={!cell.isCurrentMonth}
                className={`
                  relative h-8 rounded-xl flex items-center justify-center text-xs font-semibold transition-all
                  ${!cell.isCurrentMonth ? "text-slate-300 dark:text-slate-700 pointer-events-none opacity-40" : "cursor-pointer"}
                  ${isToday && !isSelected ? "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-black ring-1 ring-blue-500/30" : ""}
                  ${isSelected ? "bg-blue-600 text-white font-black shadow-md shadow-blue-500/20" : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"}
                `}
              >
                <span>{cell.day}</span>
                {hasEvents && (
                  <span
                    className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                      isSelected ? "bg-white" : "bg-blue-600 dark:bg-blue-400"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date indicator or reset filter */}
      {selectedDate && (
        <div className="flex items-center justify-between p-2.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-2xl text-xs">
          <span className="text-blue-700 dark:text-blue-300 font-semibold truncate">
            Filter: {selectedDate}
          </span>
          <button
            type="button"
            onClick={() => onSelectDate?.(null)}
            className="text-[11px] font-bold text-blue-600 hover:underline shrink-0 cursor-pointer"
          >
            Hapus Filter
          </button>
        </div>
      )}

      {/* Upcoming Announcements List */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Bell size={13} className="text-blue-600 dark:text-blue-400" />
            Agenda Terkini
          </h4>
          <span className="text-[10px] font-bold text-slate-400">
            {informasiList.length} Berita
          </span>
        </div>

        <div className="space-y-2.5">
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-2">
              Belum ada agenda
            </p>
          ) : (
            upcomingEvents.map((ev) => {
              const d = new Date(ev.tanggal);
              const dateText = isNaN(d.getTime())
                ? "-"
                : `${d.getDate()} ${MONTH_NAMES[d.getMonth()]}`;

              return (
                <div
                  key={ev.id}
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg text-center min-w-10 shrink-0">
                    <span className="text-[10px] font-black uppercase block leading-none">
                      {dateText}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                      {ev.judul}
                    </h5>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {ev.konten}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumMiniCalendar;
