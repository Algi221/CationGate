export interface KuotaItem {
  no: number;
  key: string;
  konsentrasi_keahlian: string;
  jumlah: number;
  target: number;
  presentase: string;
}

export interface KuotaData {
  pendaftar: KuotaItem[];
  siswaAktif: KuotaItem[];
  totalPendaftar: number;
  totalSiswaAktif: number;
  totalTarget: number;
  availablePeriodes?: string[];
  selectedPeriode?: string;
}

export interface KuotaTabProps {
  type?: "pendaftar" | "siswa-aktif" | "keseluruhan";
  variant?: "default" | "minimal";
}
