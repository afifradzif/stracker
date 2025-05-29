export type User = {
  id: string;
  username: string;
  created_at: string;
};

export type AuthResponse = {
  user: User | null;
  error: string | null;
};
