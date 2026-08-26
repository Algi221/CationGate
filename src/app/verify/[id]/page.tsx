"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { useSchoolHref } from "@/hooks/useSchoolHref";

export default function RootVerifyRedirect() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { href, isSubdomain } = useSchoolHref();

  useEffect(() => {
    if (!id) {
      router.replace(href("/"));
      return;
    }

    const redirectWithSchool = async () => {
      try {
        const res = await fetch(`/api/applicants/verify/${id}`);
        const json = await res.json();
        if (json.success && json.data) {
          const schoolSlug = json.data.school_slug || json.data.schools?.slug || "smktarunabhakti";
          if (isSubdomain) {
            router.replace(`/verify/${id}`);
          } else {
            router.replace(`/${schoolSlug}/verify/${id}`);
          }
          return;
        }
      } catch (_) {}
      if (isSubdomain) {
        router.replace(`/verify/${id}`);
      } else {
        router.replace(`/smktarunabhakti/verify/${id}`);
      }
    };

    redirectWithSchool();
  }, [id, router, href, isSubdomain]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4" />
      <p className="text-sm font-bold text-slate-600 dark:text-slate-400">
        Mengalihkan ke halaman verifikasi resmi sekolah...
      </p>
    </div>
  );
}
