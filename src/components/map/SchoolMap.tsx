"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.DivIcon({
  className: "custom-map-pin",
  html: `
    <div class="relative flex h-4 w-4 items-center justify-center">
      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD33B] opacity-75"></span>
      <span class="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FFD33B] border-2 border-white shadow-md"></span>
    </div>
  `,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface SchoolMapProps {
  schools: Array<{
    id: string | number;
    name: string;
    lat: number;
    lng: number;
    region: string;
  }>;
}

export default function SchoolMap({ schools }: SchoolMapProps) {
  const centerPosition: [number, number] = [-6.2088, 106.8456];

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 z-0 relative shadow-sm">
      <MapContainer
        center={centerPosition}
        zoom={6}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* Clean OpenStreetMap Tiles (No Watermark) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {schools.map((school) => (
          <Marker
            key={school.id}
            position={[school.lat, school.lng]}
            icon={customIcon}
          >
            <Popup>
              <div className="p-1 font-sans">
                <p className="font-extrabold text-xs text-slate-800">{school.name}</p>
                <p className="text-[10px] text-slate-500 font-semibold">{school.region}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}