"use client";

import React from "react";
import { SchoolNavbar } from "@/components/landing/SchoolNavbar";
import { SchoolFooter } from "@/components/landing/SchoolFooter";
import { useForumState } from "@/components/features/forum/hooks/useForumState";
import { ForumHero } from "@/components/features/forum/components/ForumHero";
import { ForumArticleList } from "@/components/features/forum/components/ForumArticleList";
import { ForumDetailModal } from "@/components/features/forum/components/ForumDetailModal";

export default function ForumPage() {
  const {
    schoolSlug,
    ppdbTitle,
    searchQuery,
    setSearchQuery,
    filteredInformasi,
    loading,
    selectedPost,
    setSelectedPost,
    loadingDetailId,
    handleOpenDetail
  } = useForumState();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors duration-300">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <SchoolNavbar schoolSlug={schoolSlug} />
      </header>

      {/* HERO SECTION */}
      <ForumHero
        ppdbTitle={ppdbTitle}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* ANNOUNCEMENT ARTICLE LIST */}
      <ForumArticleList
        filteredInformasi={filteredInformasi}
        loading={loading}
        searchQuery={searchQuery}
        loadingDetailId={loadingDetailId}
        handleOpenDetail={handleOpenDetail}
      />

      {/* DETAIL MODAL */}
      <ForumDetailModal
        selectedPost={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* FOOTER */}
      <SchoolFooter schoolSlug={schoolSlug} />
    </div>
  );
}
