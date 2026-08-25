import React from "react";

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
    <div className="light bg-white text-slate-950 min-h-screen w-full scheme-light" style={{ colorScheme: "light" }}>
      {children}
    </div>
  );
}
