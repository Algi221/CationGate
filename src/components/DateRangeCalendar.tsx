"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateRangeCalendarProps {
  label: string;
  startValue: string; 
  endValue: string; 
  onSelectRange: (start: string, end: string) => void;
  excludeRange?: { start: string; end: string } | null;
  error?: string | null;
  setError?: (err: string | null) => void;
}

export default function DateRangeCalendar({
  label,
  startValue,
  endValue,
  onSelectRange,
  excludeRange,
  error,
  setError
}: DateRangeCalendarProps) {
  
  const [currentDate, setCurrentDate] = useState<Date>(() => {
    if (startValue) return new Date(startValue);
    return new Date();
  });

  const [tempStart, setTempStart] = useState<Date | null>(null);

  useEffect(() => {
    if (startValue) {

      setCurrentDate(new Date(startValue));
    }
  }, [startValue]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const formatDateString = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const getDaysInMonth = (y: number, m: number): Date[] => {
    const date = new Date(y, m, 1);
    const days: Date[] = [];
    while (date.getMonth() === m) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const days = getDaysInMonth(year, month);
  const firstDayIndex = new Date(year, month, 1).getDay(); 

  const paddingDays = Array(firstDayIndex).fill(null);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: Date) => {
    if (setError) setError(null);

    if (!tempStart) {
      
      setTempStart(day);
    } else {
      
      let start = tempStart;
      let end = day;

      if (day < tempStart) {
        
        start = day;
        end = tempStart;
      }

      const startStr = formatDateString(start);
      const endStr = formatDateString(end);

      if (excludeRange && excludeRange.start && excludeRange.end) {
        const exclStart = new Date(excludeRange.start);
        const exclEnd = new Date(excludeRange.end);

        const isOverlap = 
          (start >= exclStart && start <= exclEnd) ||
          (end >= exclStart && end <= exclEnd) ||
          (start <= exclStart && end >= exclEnd);

        if (isOverlap) {
          if (setError) {
            setError(`Tanggal terpilih berbenturan (overlap) dengan rentang ${excludeRange.start} s/d ${excludeRange.end}.`);
          }
          setTempStart(null);
          return;
        }
      }

      onSelectRange(startStr, endStr);
      setTempStart(null);
    }
  };

  const isSelected = (day: Date): boolean => {
    if (!startValue || !endValue) return false;
    const dayStr = formatDateString(day);
    return dayStr >= startValue && dayStr <= endValue;
  };

  const isStart = (day: Date): boolean => {
    if (tempStart) return formatDateString(day) === formatDateString(tempStart);
    return startValue ? formatDateString(day) === startValue : false;
  };

  const isEnd = (day: Date): boolean => {
    if (tempStart) return false;
    return endValue ? formatDateString(day) === endValue : false;
  };

  const _isHoveredRange = (_day: Date): boolean => {

    return false;
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-4 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/60 pb-3">
        <div>
          <h4 className="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-500" />
            <span>{label}</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">
            {startValue && endValue ? (
              <span className="text-blue-600 dark:text-blue-450">
                {startValue} s/d {endValue}
              </span>
            ) : tempStart ? (
              <span className="text-amber-600 dark:text-amber-500">
                Mulai: {formatDateString(tempStart)} (Klik 1x lagi untuk Selesai)
              </span>
            ) : (
              "Belum ditentukan (Klik 2x di kalender)"
            )}
          </p>
        </div>

        <div className="flex gap-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/50 p-1 rounded-xl">
          <button
            type="button"
            onClick={prevMonth}
            className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[10px] font-black uppercase px-2 py-1 select-none text-slate-700 dark:text-slate-300">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="p-1 text-slate-550 hover:text-slate-800 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl text-[10px] font-semibold text-rose-600 dark:text-rose-400">
          {error}
        </div>
      )}

      {/* Calendar Grid */}
      <div>
        <div className="grid grid-cols-7 gap-1 text-center text-[9px] font-black uppercase tracking-wider text-slate-400 mb-2">
          {dayNames.map((n) => (
            <div key={n} className="py-1 select-none">
              {n}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {paddingDays.map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {days.map((day, i) => {
            const isToday = new Date().toDateString() === day.toDateString();
            const selected = isSelected(day);
            const start = isStart(day);
            const end = isEnd(day);

            let bgClass = "bg-transparent hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-350";
            if (start) {
              bgClass = "bg-blue-600 text-white font-extrabold rounded-l-xl";
            } else if (end) {
              bgClass = "bg-blue-600 text-white font-extrabold rounded-r-xl";
            } else if (selected) {
              bgClass = "bg-blue-500/20 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold";
            }

            return (
              <button
                type="button"
                key={`day-${i}`}
                onClick={() => handleDayClick(day)}
                className={`aspect-square text-[10px] font-bold rounded-lg flex flex-col items-center justify-center transition-all ${bgClass} ${
                  isToday ? "border border-blue-500/40" : ""
                }`}
              >
                <span>{day.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="text-[9px] font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider">
        💡 Double-click: Klik ke-1 untuk tanggal awal, klik ke-2 untuk tanggal akhir.
      </div>
    </div>
  );
}
