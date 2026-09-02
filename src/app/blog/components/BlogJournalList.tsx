"use client";

import React from "react";
import Image from "next/image";
import { BlogPost, blogCategories } from "../data/blogPosts";

interface BlogJournalListProps {
  filteredPosts: BlogPost[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  onSelectPost: (id: string) => void;
}

export function BlogJournalList({
  filteredPosts,
  activeCategory,
  setActiveCategory,
  onSelectPost,
}: BlogJournalListProps) {
  const mainPost = filteredPosts[0];
  const sidePosts = filteredPosts.slice(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 ease-out">
      {/* Header & Categories */}
      <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-zinc-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900">
            Journal
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Berita, wawasan, &amp; pembaruan dari CationGate.
          </p>
        </div>

        <div className="flex flex-wrap gap-1 md:gap-2">
          {blogCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === cat
                  ? "bg-zinc-900 text-white"
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Highlight Utama Kiri */}
          {mainPost && (
            <div
              className="lg:col-span-8 group cursor-pointer"
              onClick={() => onSelectPost(mainPost.id)}
            >
              <div className="relative aspect-16/10 w-full overflow-hidden mb-6 bg-zinc-100">
                <Image
                  src={mainPost.image}
                  alt={mainPost.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>

              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <span>{mainPost.category[0]}</span>
                </div>
                <h2 className="text-3xl md:text-[40px] font-bold tracking-tight leading-[1.1] text-zinc-900 group-hover:text-zinc-600 transition-colors">
                  {mainPost.title}
                </h2>
                <p className="text-zinc-500 text-lg line-clamp-2 leading-relaxed">
                  {mainPost.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-medium pt-2">
                  <span className="text-zinc-800">{mainPost.author}</span>
                  <span>—</span>
                  <span>{mainPost.date}</span>
                </div>
              </div>
            </div>
          )}

          {/* Sidebar Kanan (List) */}
          <div className="lg:col-span-4 flex flex-col">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-6 pb-4 border-b border-zinc-200">
              Artikel Lainnya
            </h3>

            <div className="flex flex-col divide-y divide-zinc-200/60">
              {sidePosts.map((post) => (
                <div
                  key={post.id}
                  className="group flex gap-5 cursor-pointer py-5 first:pt-0"
                  onClick={() => onSelectPost(post.id)}
                >
                  <div className="flex flex-col justify-center flex-1">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                      {post.category[0]}
                    </span>
                    <h4 className="text-base font-bold leading-snug group-hover:text-zinc-500 transition-colors mb-2 text-zinc-900">
                      {post.title}
                    </h4>
                    <span className="text-xs text-zinc-400 font-medium mt-auto">
                      {post.date}
                    </span>
                  </div>
                  <div className="relative w-24 aspect-square shrink-0 bg-zinc-100 overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="py-32 text-center text-zinc-400">
          <p>Belum ada jurnal di kategori ini.</p>
        </div>
      )}
    </div>
  );
}
