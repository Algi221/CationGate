import React from "react";
import { ForceLightMode } from "./ForceLightMode";

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white text-slate-950 min-h-screen w-full" style={{ colorScheme: "light" }}>
      <ForceLightMode />
      {children}
    </div>
  );
}
