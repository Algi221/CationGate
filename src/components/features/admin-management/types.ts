export interface AdminItem {
  id: number;
  username: string;
  email?: string;
  nama_lengkap: string;
  role: string;
  is_active?: boolean;
  activation_token?: string | null;
  activation_link?: string | null;
  activation_expires_at?: string | null;
  email_verified_at?: string | null;
  school_id?: string | number;
  created_at?: string;
  deleted_at?: string | null;
  status?: 'online' | 'offline' | 'away';
  is_online?: boolean;
  last_active?: string;
  foto_profil?: string | null;
}
