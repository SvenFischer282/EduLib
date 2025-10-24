import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

let user: any = null;

// User management
export const getCurrentUser = () => {
  return user;
};

export const setCurrentUser = (newUser: any): void => {
  user = newUser;
};

export const removeCurrentUser = (): void => {
  user = null;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!user;
};

// Get current user's role from authenticated user data
export function getUserRole(): "Teacher" | "Librarian" | null {
  return user?.role || null;
}

// Legacy function for backward compatibility
export function getUserId(): string {
  if (user?.id) return user.id;

  // Fallback to old logic for transition period
  const role = getUserRole() || "Teacher";
  return role === "Teacher" ? "teacher123" : "librarian456";
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User is not authenticated
      removeCurrentUser();
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
    setCurrentUser(response.data.user);
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
    setCurrentUser(response.data.user);
    return response.data;
  },

  logout: async () => {
    // await api.post("/auth/logout"); // Uncomment when logout endpoint is implemented
    removeCurrentUser();
  },

  getCurrentUser: async () => {
    if (user) {
      return user;
    }
    try {
      const response = await api.get("/auth/me");
      setCurrentUser(response.data.user);
      return response.data.user;
    } catch (error) {
      return null;
    }
  },
};