import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export type Applicant = {
  id: number;
  nama: string;
  nisn: string;
  status: "Pending" | "Approved" | "Rejected";
  tgl_daftar: string;
  jurusan_1: string;
  sekolah_asal?: string;
  [key: string]: any;
};

// Fetcher Function
const fetchApplicants = async (schoolId: string): Promise<Applicant[]> => {
  if (!schoolId) return [];
  const res = await fetch(`/api/applicants?school_id=${schoolId}`);
  if (!res.ok) throw new Error("Gagal mengambil data pendaftar");
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.data || [];
  } catch (err) {
    console.error("Invalid JSON from API:", text.substring(0, 150));
    return [];
  }
};

// Hook for fetching data with Supabase Realtime (no polling)
export const useApplicants = (schoolId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["applicants", schoolId],
    queryFn: () => fetchApplicants(schoolId),
    enabled: !!schoolId,
    // Removed refetchInterval — Supabase Realtime handles updates
    refetchOnWindowFocus: true,
  });

  // Subscribe to Supabase Realtime changes on student_applicants table
  useEffect(() => {
    if (!schoolId) return;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return;

    const supabase = createClient(supabaseUrl, supabaseKey);
    const channel = supabase
      .channel(`dashboard:applicants:${schoolId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "student_applicants",
          filter: `school_id=eq.${schoolId}`,
        },
        () => {
          // Invalidate cache → TanStack Query refetches automatically
          queryClient.invalidateQueries({ queryKey: ["applicants", schoolId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [schoolId, queryClient]);

  return query;
};

// Hook for Optimistic Status Update
export const useUpdateApplicantStatus = (schoolId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await fetch(`/api/applicants/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Gagal update status");
      const text = await res.text();
      try {
        return JSON.parse(text);
      } catch (err) {
        console.error("Invalid JSON from API:", text.substring(0, 150));
        throw new Error("Invalid response from server");
      }
    },
    // OPTIMISTIC UPDATE TRICK
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["applicants", schoolId] });

      const previousApplicants = queryClient.getQueryData<Applicant[]>([
        "applicants",
        schoolId,
      ]);

      if (previousApplicants) {
        queryClient.setQueryData<Applicant[]>(
          ["applicants", schoolId],
          (old) =>
            old?.map((applicant) =>
              applicant.id === id ? { ...applicant, status: status as any } : applicant
            )
        );
      }

      return { previousApplicants };
    },
    onError: (err, newApplicant, context) => {
      // Rollback to previous data on error
      if (context?.previousApplicants) {
        queryClient.setQueryData(
          ["applicants", schoolId],
          context.previousApplicants
        );
      }
    },
    onSettled: () => {
      // Always refetch to sync with server
      queryClient.invalidateQueries({ queryKey: ["applicants", schoolId] });
    },
  });
};
