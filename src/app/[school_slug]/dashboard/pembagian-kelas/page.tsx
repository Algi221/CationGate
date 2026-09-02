"use client";

import React, { Suspense } from "react";
import { usePPDB } from "@/context/PPDBContext";
import { usePembagianKelasState } from "@/components/features/pembagian-kelas/hooks/usePembagianKelasState";
import { AddClassModal } from "@/components/features/pembagian-kelas/components/AddClassModal";
import { ClassDetailModal } from "@/components/features/pembagian-kelas/components/ClassDetailModal";
import { PembagianKelasHeaderStats } from "@/components/features/pembagian-kelas/components/PembagianKelasHeaderStats";
import { PembagianKelasStudentTable } from "@/components/features/pembagian-kelas/components/PembagianKelasStudentTable";
import { useSchoolHref } from "@/hooks/useSchoolHref";
import { GradeLevel } from "@/components/features/pembagian-kelas/types";

function ClassDivisionManagementContent() {
  const { ppdbTitle } = usePPDB();
  const { href } = useSchoolHref();
  const {
    selectedMajor,
    setSelectedMajor,
    selectedGrade,
    setSelectedGrade,
    activeMajors,
    classesOfSelectedMajor,
    filteredStudents,
    paginatedStudents,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    classEnrollments,
    filledClassesCount,
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
    handleAssignSingleStudent,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCreateClass,
    handleDeleteClass,
    handleRemoveStudentFromClassDetail,
    handleExportClassCSV,
    handleExportAllClasses,
    handleExportAllMajors,
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

      {/* Header Stat Cards, Major Selector, Grade Level, and Class Cards Grid */}
      <PembagianKelasHeaderStats
        ppdbTitle={ppdbTitle}
        selectedGrade={selectedGrade}
        selectedMajor={selectedMajor}
        classesOfSelectedMajor={classesOfSelectedMajor}
        filledClassesCount={filledClassesCount}
        activeMajors={activeMajors}
        setSelectedMajor={setSelectedMajor}
        setSelectedGrade={setSelectedGrade}
        gradeList={gradeList}
        kelolaHref={href("/dashboard/kelola-ui?tab=majors")}
        handleExportAllClasses={handleExportAllClasses}
        handleExportAllMajors={handleExportAllMajors}
        setIsAddingClass={setIsAddingClass}
        classEnrollments={classEnrollments}
        activeDropClass={activeDropClass}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        handleDrop={handleDrop}
        handleDeleteClass={handleDeleteClass}
        setSelectedClassDetail={setSelectedClassDetail}
      />

      {/* Student Table, Filters, and Pagination */}
      <PembagianKelasStudentTable
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        assignmentFilter={assignmentFilter}
        setAssignmentFilter={setAssignmentFilter}
        genderFilter={genderFilter}
        setGenderFilter={setGenderFilter}
        selectedStudentIds={selectedStudentIds}
        isLoading={isLoading}
        handleAssignSelectedToClass={handleAssignSelectedToClass}
        classesOfSelectedMajor={classesOfSelectedMajor}
        filteredStudents={filteredStudents}
        paginatedStudents={paginatedStudents}
        handleSelectAll={handleSelectAll}
        handleSelectStudent={handleSelectStudent}
        handleDragStart={handleDragStart}
        nipdMap={nipdMap}
        selectedMajor={selectedMajor}
        handleAssignSingleStudent={handleAssignSingleStudent}
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        totalPages={totalPages}
      />

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
