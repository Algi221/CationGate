"use client";

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const createCustomIcon = (status?: string) => {
  const isVerified = status === "FULL_VERIFIED" || status === "VERIFIED";
  const isPending = status === "PENDING_VERIFICATION";
  const pinColor = isVerified ? "bg-emerald-500" : isPending ? "bg-[#FFD33B]" : "bg-sky-500";

  return new L.DivIcon({
    className: "custom-map-pin",
    html: `
      <div class="relative flex h-5 w-5 items-center justify-center">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${pinColor} opacity-60"></span>
        <span class="relative inline-flex rounded-full h-3.5 w-3.5 ${pinColor} border-2 border-white shadow-md"></span>
      </div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export interface MapSchoolItem {
  id: string | number;
  name: string;
  slug?: string;
  lat: number;
  lng: number;
  region: string;
  status?: string;
  npsn?: string;
}

interface SchoolMapProps {
  schools: MapSchoolItem[];
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const centerPosition: [number, number] = [-7.0, 108.5]; // Centered nicely over Java & Bali

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 z-0 relative shadow-sm">
      <MapContainer
        center={centerPosition}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {schools.map((school) => (
          <Marker
            key={school.id}
            position={[school.lat, school.lng]}
            icon={createCustomIcon(school.status)}
          >
            <Popup>
              <div className="p-1 font-sans min-w-36 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {school.status === "FULL_VERIFIED" ? "Terverifikasi" : school.status === "PENDING_VERIFICATION" ? "Menunggu SK" : "Trial"}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{school.region}</span>
                </div>
                <p className="font-extrabold text-xs text-slate-900 leading-snug">{school.name}</p>
                {school.slug && (
                  <p className="text-[10px] text-blue-600 font-mono font-bold">
                    {school.slug}.cationgate.site
                  </p>
                )}
                {school.npsn && (
                  <p className="text-[9px] text-slate-500 font-mono">NPSN: {school.npsn}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}