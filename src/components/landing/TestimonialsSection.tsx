"use client";

import React from "react";
import { Star, CheckCircle2, Code2, Cpu, GraduationCap, Building2 } from "lucide-react";

export function TestimonialsSection() {
  // Testimonials specified in PRD
  const testimonials = [
    {
      quote: "The real-time dashboards are incredible. We identified reading comprehension bottlenecks across Grade 9 in week 1 and adjusted our curriculum instantly.",
      author: "Dr. Aris Setiawan, M.Ed.",
      role: "Academic Director, SMA Global Mandiri",
      badge: "School Administrator",
      avatar: "A",
      color: "bg-blue-600",
    },
    {
      quote: "CationGate's AI lesson generation saved me over 10 hours a week. The adaptive quizzes keep students engaged without manual grading queues.",
      author: "Dewi Lestari, S.Pd.",
      role: "Senior STEM Educator, Telkom Academy",
      badge: "Master Educator",
      avatar: "D",
      color: "bg-teal-600",
    },
    {
      quote: "The personalized learning pathway adapted to my pace in Advanced Physics. I scored in the top 1% on national university entrance exams.",
      author: "Fajar Pratama",
      role: "Student, Grade 12 STEM Scholar",
      badge: "Student Success",
      avatar: "F",
      color: "bg-indigo-600",
    },
  ];

  // Our Team / Expert Educators specified in PRD
  const teamMembers = [
    {
      name: "Dr. Elena Rostova",
      role: "Head of Learning AI Architecture",
      bio: "Former Stanford EdTech Fellow with 12+ years in adaptive neural learning algorithms.",
      icon: Cpu,
    },
    {
      name: "Budi Satria, M.T.",
      role: "VP of Enterprise Engineering",
      bio: "Ex-Google Lead Systems Architect specializing in sub-second multi-tenant databases.",
      icon: Code2,
    },
    {
      name: "Prof. Hendra Kusuma",
      role: "Curriculum Alignment Advisor",
      bio: "National Education Board Consultant specializing in Kemendikbud K-12 integration.",
      icon: GraduationCap,
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section 1: The Minds Behind the Technology (Team) */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
              <Cpu className="w-3.5 h-3.5 text-blue-600" />
              Ed-Tech Leadership
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              The Minds Behind the Technology
            </h2>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Engineers, researchers, and master educators building the future of adaptive learning.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => {
              const Icon = member.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100 shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900">{member.name}</h3>
                      <div className="text-xs font-bold text-blue-600">{member.role}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {member.bio}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Testimonial Grid */}
        <div id="testimoni">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200">
              <Star className="w-3.5 h-3.5 fill-current text-teal-600" />
              Verified Feedback
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Trusted By Administrators, Teachers & Students
            </h2>

            <p className="text-slate-600 text-base leading-relaxed font-medium">
              Read how CationGate delivers real impact in classrooms across Indonesia.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                      {t.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6 font-medium">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${t.color} text-white font-black flex items-center justify-center text-sm shrink-0 shadow-2xs`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-slate-900 flex items-center gap-1">
                      <span>{t.author}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {t.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
