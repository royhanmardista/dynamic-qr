const TOKEN_STORAGE_KEY = "staffany_auth_token";
const USER_STORAGE_KEY = "staffany_auth_user";

export const useSessionStorage = () => {
  const saveToken = (authToken: string, phoneNumber: string) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, authToken);
    localStorage.setItem(USER_STORAGE_KEY, phoneNumber);
  };

  const clearToken = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  const user = localStorage.getItem(USER_STORAGE_KEY);
  const isAuthenticated = Boolean(token && user);

  return {
    token,
    user,
    isAuthenticated,
    saveToken,
    clearToken,
  };
};
