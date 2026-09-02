"use client";

import { useEffect } from "react";
import { RegistrationFormData } from "../types";

interface UseRegistrationPaymentSyncProps {
  schoolSlug: string;
  isSuccess: boolean;
  setIsSuccess: React.Dispatch<React.SetStateAction<boolean>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSuccessData: React.Dispatch<React.SetStateAction<any>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submittedCandidate: any;
  formData: RegistrationFormData;
  setFormData: React.Dispatch<React.SetStateAction<RegistrationFormData>>;
  fetchPublicApplicants?: () => Promise<void>;
}

export function useRegistrationPaymentSync({
  schoolSlug,
  isSuccess,
  setIsSuccess,
  setSuccessData,
  submittedCandidate,
  formData,
  setFormData,
  fetchPublicApplicants,
}: UseRegistrationPaymentSyncProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const payment = urlParams.get("payment");
      const nisn = urlParams.get("nisn");
      if (payment === "success" && nisn) {
        const forceVerifyAndShowSuccess = async () => {
          try {
            const res = await fetch(`/api/payment/confirm-payment-option`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nisn: nisn,
                bukti_bayar: null,
                metode_pembayaran: "Payment Gateway",
                school_slug: schoolSlug,
              }),
            });
            const data = await res.json();
            localStorage.removeItem("ppdb_active_checkout");
            if (data.success && data.data) {
              setSuccessData(data.data);
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: nisn,
                  success: true,
                  successData: data.data,
                }),
              );
            } else {
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: nisn,
                  success: true,
                }),
              );
            }
            setFormData((prev) => ({ ...prev, nisn: nisn }));
            setIsSuccess(true);
            fetchPublicApplicants?.();
          } catch (err) {
            console.log("Error force verifying redirected payment status:", err);
          }
        };
        forceVerifyAndShowSuccess();
      }
    }
  }, [fetchPublicApplicants, schoolSlug, setFormData, setIsSuccess, setSuccessData]);

  useEffect(() => {
    if (isSuccess) {
      const targetNisn =
        formData.nisn ||
        (submittedCandidate as { nisn?: string } | null)?.nisn;
      if (targetNisn) {
        const fetchSuccessData = async () => {
          try {
            const res = await fetch(
              `/api/applicants/public-invoice/${targetNisn}`,
            );
            const json = await res.json();
            if (json.success && json.data) {
              setSuccessData(json.data);
              localStorage.setItem(
                "ppdb_registration_success",
                JSON.stringify({
                  nisn: targetNisn,
                  success: true,
                  successData: json.data,
                }),
              );
            }
          } catch (err) {
            console.log("Failed to fetch success candidate details:", err);
          }
        };
        fetchSuccessData();
      }
    }
  }, [isSuccess, formData.nisn, submittedCandidate, setSuccessData]);
}
