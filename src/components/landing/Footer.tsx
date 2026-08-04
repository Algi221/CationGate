"use client";

import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Footer Top Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand & Mission */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs">
                <Layers className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Cation<span className="text-blue-500">Gate</span>
              </span>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              Next-generation AI ed-tech SaaS platform accelerating personalized learning, real-time analytics, and Dapodik compliance.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 text-xs font-bold">
              <Activity className="w-3.5 h-3.5" />
              <span>Multi-Tenant SLA Uptime 99.99%</span>
            </div>
          </div>

          {/* Core Capabilities */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold text-white uppercase tracking-wider">
              Platform
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#capabilities" className="hover:text-blue-400 transition-colors">AI Lesson Generator</a></li>
              <li><a href="#capabilities" className="hover:text-blue-400 transition-colors">Adaptive Quizzes</a></li>
              <li><a href="#capabilities" className="hover:text-blue-400 transition-colors">Student Telemetry</a></li>
              <li><a href="#capabilities" className="hover:text-blue-400 transition-colors">Resource Marketplace</a></li>
              <li><a href="#capabilities" className="hover:text-blue-400 transition-colors">Dapodik Export Engine</a></li>
            </ul>
          </div>

          {/* Solutions */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold text-white uppercase tracking-wider">
              Solutions
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#about" className="hover:text-blue-400 transition-colors">K-12 Primary Schools</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">High Schools & Academies</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">Higher Ed Universities</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition-colors">Foundation Networks</a></li>
            </ul>
          </div>

          {/* Company & Support */}
          <div className="space-y-3">
            <div className="text-xs font-extrabold text-white uppercase tracking-wider">
              Company
            </div>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li><a href="#faq" className="hover:text-blue-400 transition-colors">Platform FAQ</a></li>
              <li><Link href="/daftar" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/daftar" className="hover:text-blue-400 transition-colors">Privacy & Security</Link></li>
              <li><a href="https://wa.me/6281292244456" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">Engineering Support</a></li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-medium">
          <div>
            © 2026 CationGate Technologies Inc. All rights reserved. Built for modern education.
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>ISO 27001 Certified</span>
            <span>•</span>
            <span>AES-256 Encrypted</span>
            <span>•</span>
            <span>Kemendikbud Compliant</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
