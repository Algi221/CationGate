"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface RegistrationAreaChartProps {
  data: number[];
  labels: string[];
  color?: string;
}

export const RegistrationAreaChart: React.FC<RegistrationAreaChartProps> = ({
  data,
  labels,
  color = "#2563eb"
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains("dark"));
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const id = requestAnimationFrame(checkDark);
    return () => {
      cancelAnimationFrame(id);
      observer.disconnect();
    };
  }, []);

  const series = [
    {
      name: "Pendaftar",
      data: data
    }
  ];

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      fontFamily: "inherit",
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0
    },
    colors: [color],
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.45,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 2.5
    },
    grid: {
      borderColor: isDark ? "#1e293b" : "#f1f5f9",
      strokeDashArray: 4,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
      padding: { top: 0, right: 10, bottom: 0, left: 10 }
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: isDark ? "#64748b" : "#94a3b8",
          fontSize: "11px",
          fontWeight: 500
        }
      }
    },
    yaxis: {
      labels: {
        style: {
          colors: isDark ? "#64748b" : "#94a3b8",
          fontSize: "11px",
          fontWeight: 500
        },
        formatter: (val: number) => `${Math.round(val)}`
      },
      min: 0,
      forceNiceScale: true
    },
    tooltip: {
      theme: isDark ? "dark" : "light"
    }
  };

  return (
    <div className="w-full h-75">
      <div className="-ml-3">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={320}
          width={"100%"}
        />
      </div>
    </div>
  );
};
