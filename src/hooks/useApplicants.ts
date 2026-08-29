import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getBrowserSupabase } from "@/lib/supabase-client";

export type Applicant = {
  id: number;
  nama: string;
  nisn: string;
  status: "Pending" | "Approved" | "Rejected";
  tgl_daftar: string;
  jurusan_1: string;
  sekolah_asal?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const fetchApplicants = async (schoolId: string, isPublic: boolean = false): Promise<Applicant[]> => {
  if (!schoolId) return [];
  const token = !isPublic && typeof window !== "undefined" ? localStorage.getItem("ppdb_admin_token") : "";
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const endpoint = token ? `/api/applicants?school_id=${encodeURIComponent(schoolId)}` : `/api/applicants/public?school_slug=${encodeURIComponent(schoolId)}`;
  try {
    const res = await fetch(endpoint, { headers });
    if (!res.ok) {
      // Fallback to public if admin fails
      const publicRes = await fetch(`/api/applicants/public?school_slug=${encodeURIComponent(schoolId)}`);
      if (publicRes.ok) {
        const publicData = await publicRes.json();
        return publicData.data || [];
      }
      return [];
    }
    const data = await res.json();
    return data.data || [];
  } catch (_err) {
    try {
      const publicRes = await fetch(`/api/applicants/public?school_slug=${encodeURIComponent(schoolId)}`);
      if (publicRes.ok) {
        const publicData = await publicRes.json();
        return publicData.data || [];
      }
    } catch (_fallbackErr) {}
    return [];
  }
};

// Hook for fetching data with Supabase Realtime (no polling)
export const useApplicants = (schoolId: string, isPublic: boolean = false) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["applicants", schoolId, isPublic ? "public" : "admin"],
    queryFn: () => fetchApplicants(schoolId, isPublic),
    enabled: !!schoolId,
    refetchOnWindowFocus: true,
    staleTime: 30000,
  });

  // Subscribe to Supabase Realtime changes on student_applicants table
  useEffect(() => {
    if (!schoolId) return;
    const supabase = getBrowserSupabase();
    if (!supabase) return;

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
      } catch (_err) {
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
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
