export type User = {
  id: string;
  username: string;
  created_at: string;
};

export type AuthResponse = {
  user: User | null;
  error: string | null;
};

export type StudyPlan = {
  id: string;
  user_id: string;
  title: string;
  date: Date;
  reminder: string;
  daily_motivation: string;
  completed: boolean;
  created_at: string;
};
