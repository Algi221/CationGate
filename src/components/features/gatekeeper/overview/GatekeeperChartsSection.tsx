"use client";

import React from "react";
import dynamic from "next/dynamic";
import { TrendingUp, PieChart } from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface GatekeeperChartsSectionProps {
  isMounted: boolean;
  totalSchoolsCount: number;
  verifiedCount: number;
  pendingCount: number;
  unverifiedCount: number;
}

export function GatekeeperChartsSection({
  isMounted,
  totalSchoolsCount,
  verifiedCount,
  pendingCount,
  unverifiedCount,
}: GatekeeperChartsSectionProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chartOptions: any = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      background: "transparent",
    },
    labels: ["Terverifikasi", "Menunggu Verifikasi", "Belum Mengirim Berkas"],
    colors: ["#059669", "#FFD33B", "#2e3749"],
    stroke: { width: 0 },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: "75%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", fontWeight: 600, color: "#94a3b8" },
            value: { show: true, fontSize: "24px", fontWeight: 800, color: "#FFD33B" },
            total: {
              show: true,
              showAlways: true,
              label: "Total",
              color: "#94a3b8",
              fontSize: "12px",
              fontWeight: 600,
            },
          },
        },
      },
    },
    legend: {
      show: true,
      position: "bottom",
      fontSize: "12px",
      fontWeight: 600,
      labels: { colors: "#94a3b8" },
      markers: { width: 10, height: 10, radius: 10, offsetX: -4 },
    },
    theme: { mode: "dark" },
  };

  const chartSeries = [verifiedCount, pendingCount, unverifiedCount];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Tren Pendaftaran Institusi
            </h3>
            <p className="text-xs text-slate-500 dark:text-white/60">
              Pertumbuhan sekolah pengguna CationGate (7 bulan terakhir)
            </p>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/10 text-[#2e3749] dark:text-[#FFD33B] border border-slate-200 dark:border-white/10">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="h-64 w-full">
          {isMounted && (
            <Chart
              options={{
                chart: {
                  type: "area",
                  fontFamily: "inherit",
                  toolbar: { show: false },
                  zoom: { enabled: false },
                },
                colors: ["#FFD33B"],
                fill: {
                  type: "gradient",
                  gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.35,
                    opacityTo: 0.05,
                    stops: [0, 90, 100],
                  },
                },
                dataLabels: { enabled: false },
                stroke: { curve: "smooth", width: 3 },
                xaxis: {
                  categories: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul"],
                  axisBorder: { show: false },
                  axisTicks: { show: false },
                  labels: { style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 500 } },
                },
                yaxis: {
                  labels: { style: { colors: "#94a3b8", fontSize: "12px", fontWeight: 500 } },
                },
                grid: {
                  borderColor: "rgba(255,255,255,0.05)",
                  strokeDashArray: 4,
                  xaxis: { lines: { show: false } },
                  yaxis: { lines: { show: true } },
                  padding: { top: 0, right: 0, bottom: 0, left: 10 },
                },
                tooltip: { theme: "dark" },
              }}
              series={[
                {
                  name: "Sekolah Terdaftar",
                  data: [5, 12, 18, 24, 35, 42, totalSchoolsCount > 42 ? totalSchoolsCount : 56],
                },
              ]}
              type="area"
              height="100%"
            />
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#2e3749] rounded-3xl border border-slate-200 dark:border-white/10 p-6 shadow-xs flex flex-col justify-between">
        <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#FFD33B]" /> Rasio Status Verifikasi
        </h3>

        <div className="relative my-auto py-2">
          {isMounted && (
            <Chart options={chartOptions} series={chartSeries} type="donut" height="230" />
          )}
        </div>
      </div>
    </div>
  );
}
