import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

// Auth token management
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
};

// User management
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: any): void => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Legacy function for backward compatibility
export function getUserId(): string {
  const user = getCurrentUser();
  if (user?.id) return user.id;

  // Fallback to old logic for transition period
  const role = (localStorage.getItem("role") || "Teacher") as
    | "Teacher"
    | "Librarian";
  return role === "Teacher" ? "teacher123" : "librarian456";
}

export const api = axios.create({ baseURL: BASE_URL });

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  const token = getAuthToken();
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  // Keep legacy header for backward compatibility during transition
  config.headers["X-User-ID"] = getUserId();
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      removeAuthToken();
      // Redirect to login if not already there
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  },

  register: async (
    username: string,
    password: string,
    role: string,
    classAssignment?: string
  ) => {
    const response = await api.post("/auth/register", {
      username,
      password,
      role,
      classAssignment,
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
