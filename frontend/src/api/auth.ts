/**
 * Authentication & Token Storage Helpers
 * Manages JWT tokens, security headers, and authentication state persistence.
 */

const TOKEN_KEY = "verisphere_jwt_token";
const USER_KEY = "verisphere_user_profile";

export const getStoredToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (e) {
    console.warn("Unable to access localStorage for JWT token:", e);
    return null;
  }
};

export const setStoredToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (e) {
    console.warn("Unable to save JWT token to localStorage:", e);
  }
};

export const removeStoredToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (e) {
    console.warn("Unable to clear auth storage:", e);
  }
};

export const isAuthenticated = (): boolean => {
  const token = getStoredToken();
  return !!token;
};

export const handleUnauthorizedRedirect = (): void => {
  removeStoredToken();
  // If route auth is enforced in the future, trigger redirect here
  if (typeof window !== "undefined") {
    console.warn("Unauthorized access detected. Session reset.");
  }
};
