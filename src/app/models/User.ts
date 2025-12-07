export interface UserData {
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  preferred_name?: string | null;
  email: string;
  bio?: string | null;
  avatar_url?: string | null;
  created_at: string;
  updated_at: string;
  
  followers: Followers[];
  following: Following[];
}

export interface Followers{
    id: number;
    name: string;
    preferred_name?: string | null;
    email: string;
    bio?: string | null;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Following{
    id: number;
    name: string;
    preferred_name?: string | null;
    email: string;
    bio?: string | null;
    avatar_url?: string | null;
    created_at: string;
    updated_at: string;
}