"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { blogPosts } from "./data/blogPosts";
import { BlogJournalList, BlogArticleDetail } from "./components";

export default function BlogPage() {
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = useMemo(() => {
    return activeCategory === "Semua"
      ? blogPosts
      : blogPosts.filter((post) => post.category.includes(activeCategory));
  }, [activeCategory]);

  const activePost = blogPosts.find((p) => p.id === activePostId);

  const handleSelectRelatedPost = (id: string) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setActivePostId(id);
  };

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 flex flex-col justify-between font-sans selection:bg-zinc-200 selection:text-zinc-900">
      <Navbar />

      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {!activePost ? (
          <BlogJournalList
            filteredPosts={filteredPosts}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onSelectPost={setActivePostId}
          />
        ) : (
          <BlogArticleDetail
            activePost={activePost}
            onBack={() => setActivePostId(null)}
            onSelectRelatedPost={handleSelectRelatedPost}
          />
        )}
      </main>

      <CinematicFooter />
    </div>
  );
}
