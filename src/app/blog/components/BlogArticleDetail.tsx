"use client";

import React from "react";
import Image from "next/image";
import { ArrowLeft, Clock, ArrowUpRight } from "lucide-react";
import { BlogPost, blogPosts } from "../data/blogPosts";

interface BlogArticleDetailProps {
  activePost: BlogPost;
  onBack: () => void;
  onSelectRelatedPost: (id: string) => void;
}

export function BlogArticleDetail({
  activePost,
  onBack,
  onSelectRelatedPost,
}: BlogArticleDetailProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out max-w-5xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 hover:text-zinc-900 transition-colors mb-12 group cursor-pointer"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Kembali ke Jurnal
      </button>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
            {activePost.category[0]}
          </span>
          <span className="text-zinc-300">•</span>
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
            <Clock size={14} /> {activePost.readTime}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-zinc-900 mb-8 max-w-4xl">
          {activePost.title}
        </h1>

        <div className="flex items-center gap-4 text-sm">
          <Image
            src={activePost.authorImg}
            alt={activePost.author}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full bg-zinc-200 object-cover"
          />
          <div>
            <div className="text-zinc-900 font-bold">{activePost.author}</div>
            <div className="text-zinc-500">{activePost.date}</div>
          </div>
        </div>
      </header>

      <div className="relative w-full aspect-video md:aspect-2.5/1 bg-zinc-100 mb-14">
        <Image
          src={activePost.image}
          alt={activePost.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
        {/* Kolom Konten Teks */}
        <article className="lg:col-span-8">
          <p className="text-xl md:text-[22px] font-medium text-zinc-800 leading-relaxed mb-10 pb-10 border-b border-zinc-200 tracking-tight">
            {activePost.excerpt}
          </p>

          {activePost.content}

          {/* Author Info Minimalist */}
          <div className="mt-20 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row gap-6 items-start">
            <Image
              src={activePost.authorImg}
              alt={activePost.author}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full bg-zinc-200 grayscale object-cover"
            />
            <div>
              <h3 className="text-lg font-bold text-zinc-900">
                {activePost.author}
              </h3>
              <span className="text-sm font-medium text-zinc-500 block mb-3">
                {activePost.authorRole}
              </span>
              <p className="text-zinc-600 text-sm leading-relaxed max-w-md">
                {activePost.authorBio}
              </p>
            </div>
          </div>
        </article>

        {/* Sidebar Detail (Sticky Minimalist) */}
        <aside className="lg:col-span-4 relative">
          <div className="sticky top-32 space-y-12">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-4 border-b border-zinc-200">
                Baca Selanjutnya
              </h3>

              <div className="flex flex-col space-y-6">
                {blogPosts
                  .filter((p) => p.id !== activePost.id)
                  .slice(0, 3)
                  .map((post) => (
                    <div
                      key={post.id}
                      className="group cursor-pointer"
                      onClick={() => onSelectRelatedPost(post.id)}
                    >
                      <h4 className="text-base font-bold leading-snug group-hover:text-zinc-500 transition-colors mb-2 text-zinc-900">
                        {post.title}
                      </h4>
                      <span className="text-xs text-zinc-400 font-medium">
                        {post.readTime}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* CTA Widget Bersih */}
            <div className="bg-zinc-900 text-white p-8 group cursor-pointer hover:bg-zinc-800 transition-colors">
              <h3 className="text-xl font-bold mb-3">
                Siap Beralih ke CationGate?
              </h3>
              <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                Jelajahi bagaimana ekosistem kami dapat mendigitalisasi institusi
                pendidikan Anda.
              </p>
              <button className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider hover:text-zinc-300 transition-colors cursor-pointer">
                Mulai Demo <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
