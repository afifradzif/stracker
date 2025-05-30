let currentUserName: string | null = null;

export const setCurrentUserName = (name: string) => {
  currentUserName = name;
};

export const getCurrentUserName = () => {
  return currentUserName || 'User';
};
