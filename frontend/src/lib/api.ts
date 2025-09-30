import axios from "axios";

export const BASE_URL = "http://localhost:3000/api";

export function getUserId(): string {
  const role = (localStorage.getItem("role") || "Teacher") as
    | "Teacher"
    | "Librarian";
  return role === "Teacher" ? "teacher123" : "librarian456";
}

export const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["X-User-ID"] = getUserId();
  return config;
});
