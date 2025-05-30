let currentUserId: string | null = null;

export const setCurrentUserId = (userId: string) => {
  currentUserId = userId;
};

export const getCurrentUserId = () => {
  return currentUserId;
};
