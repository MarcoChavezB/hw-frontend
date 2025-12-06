interface User {
  id: number;
  name: string;
  preferred_name?: string | null;
  email: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserData {
  user: User;
  token: string;
}