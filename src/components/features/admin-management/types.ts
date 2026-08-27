export interface AdminItem {
  id: number;
  username: string;
  nama_lengkap: string;
  role: string;
  school_id?: string | number;
  created_at?: string;
  deleted_at?: string | null;
  status?: 'online' | 'offline' | 'away';
  is_online?: boolean;
  last_active?: string;
}
