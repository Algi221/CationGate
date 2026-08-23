"use client";

import React, { Suspense } from "react";
import Image from "next/image";
import { 
  Download, 
  GraduationCap
} from "lucide-react";
import { usePembagianKelasState } from "@/components/features/pembagian-kelas/hooks/usePembagianKelasState";
import { UnassignedPanel } from "@/components/features/pembagian-kelas/components/UnassignedPanel";
import { ClassCardGrid } from "@/components/features/pembagian-kelas/components/ClassCardGrid";
import { AddClassModal } from "@/components/features/pembagian-kelas/components/AddClassModal";
import { ClassDetailModal } from "@/components/features/pembagian-kelas/components/ClassDetailModal";
import { GradeLevel } from "@/components/features/pembagian-kelas/types";

function ClassDivisionManagementContent() {
  const {
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    activeMajors,
    classesOfSelectedMajor,
    filteredStudents,
    classEnrollments,
    selectedStudentIds,
    searchTerm,
    setSearchTerm,
    assignmentFilter,
    setAssignmentFilter,
    genderFilter,
    setGenderFilter,
    isLoading,
    toast,
    isAddingClass,
    setIsAddingClass,
    newClassName,
    setNewClassName,
    selectedClassDetail,
    setSelectedClassDetail,
    enrolledStudentsInDetail,
    classSearchTerm,
    setClassSearchTerm,
    activeDropClass,
    nipdMap,
    handleSelectAll,
    handleSelectStudent,
    handleAssignSelectedToClass,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
    handleExportClassCSV,
    handleExportAllClasses
  } = usePembagianKelasState();

  const gradeList: GradeLevel[] = [10, 11, 12];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 text-left">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl border text-xs font-black uppercase tracking-wider flex items-center gap-3 ${
              toast.type === "success"
                ? "bg-emerald-600 text-white border-emerald-500"
                : toast.type === "error"
                ? "bg-rose-600 text-white border-rose-500"
                : "bg-blue-600 text-white border-blue-500"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Grade Level Selector Tabs (Kelas X, XI, XII) */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/60 rounded-3xl p-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 w-full md:w-auto">
          {gradeList.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                selectedGrade === grade
                  ? "bg-blue-600 text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] scale-[1.02]"
                  : "bg-slate-100 dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              <GraduationCap size={15} />
              <span>Kelas {grade === 10 ? "X" : grade === 11 ? "XI" : "XII"}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportAllClasses}
            disabled={classesOfSelectedMajor.length === 0}
            className="w-full md:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.2)] cursor-pointer disabled:opacity-40"
          >
            <Download size={14} />
            <span>Ekspor Semua Kelas (Excel)</span>
          </button>
        </div>
      </div>

      {/* Major Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activeMajors.map((major) => {
          const isSelected = selectedMajor === major.code;
          return (
            <button
              key={major.code}
              onClick={() => setSelectedMajor(major.code)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2.5 shrink-0 border cursor-pointer ${
                isSelected
                  ? "bg-white dark:bg-[#0f172a] text-blue-600 dark:text-white border-blue-500 shadow-sm"
                  : "bg-white dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800/60 hover:border-slate-300"
              }`}
            >
              {major.logo && (
                <Image
                  src={major.logo}
                  alt={major.name || major.code}
                  width={18}
                  height={18}
                  className="w-4.5 h-4.5 rounded-full object-cover shrink-0"
                  unoptimized
                />
              )}
              <span>{major.name || major.code}</span>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Unassigned Students (Left) vs Class Cards (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calon Siswa (4 cols on lg) */}
        <div className="lg:col-span-5 xl:col-span-4">
          <UnassignedPanel
            students={filteredStudents}
            classes={classesOfSelectedMajor}
            selectedStudentIds={selectedStudentIds}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            assignmentFilter={assignmentFilter}
            setAssignmentFilter={setAssignmentFilter}
            genderFilter={genderFilter}
            setGenderFilter={setGenderFilter}
            onSelectAll={handleSelectAll}
            onSelectStudent={handleSelectStudent}
            onAssignSelected={handleAssignSelectedToClass}
            onDragStart={handleDragStart}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: Rombel Grid (7/8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8">
          <ClassCardGrid
            classes={classesOfSelectedMajor}
            classEnrollments={classEnrollments}
            activeDropClass={activeDropClass}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onSelectClassDetail={setSelectedClassDetail}
            onExportClassCSV={handleExportClassCSV}
            onDeleteClass={handleDeleteClass}
            onOpenAddClassModal={() => setIsAddingClass(true)}
          />
        </div>
      </div>

      {/* Add Custom Class Modal */}
      <AddClassModal
        isOpen={isAddingClass}
        selectedGrade={selectedGrade}
        selectedMajor={selectedMajor}
        newClassName={newClassName}
        setNewClassName={setNewClassName}
        onClose={() => setIsAddingClass(false)}
        onCreateClass={handleCreateClass}
      />

      {/* Class Detail Modal */}
      <ClassDetailModal
        selectedClassDetail={selectedClassDetail}
        enrolledStudents={enrolledStudentsInDetail}
        classSearchTerm={classSearchTerm}
        setClassSearchTerm={setClassSearchTerm}
        nipdMap={nipdMap}
        onClose={() => setSelectedClassDetail(null)}
        onRemoveStudent={handleRemoveStudentFromClassDetail}
        onExportCSV={handleExportClassCSV}
      />
    </div>
  );
}

export default function ClassDivisionManagement() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">
          Memuat pembagian kelas...
        </div>
      }
    >
      <ClassDivisionManagementContent />
    </Suspense>
  );
}
