import { ApiResponse } from "@/lib/types";
import { authFetch } from "./api-interceptor";

// lib/auth-api.ts
// const API_BASE_URL = "https://safepredictions.net";
const API_BASE_URL = "http://localhost:3000";

// Base fetch wrapper with credentials (important for cookies)
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: "include", // Critical: includes cookies in requests
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

const authApiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await authFetch(url, config); // Use authFetch for protected endpoints
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || "Request failed");
    }

    return data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Lecturer signup interface
interface LecturerSignupData {
  pfNumber: string;
  title: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password: string;
  courses?: string[];
}

// Lecturer-specific API functions
export const lecturerApi = {
  login: async (username: string, password: string) => {
    return apiRequest<any>("/api/lecturer/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
  },

  signup: async (signupData: LecturerSignupData) => {
    return apiRequest<any>("/api/lecturer/signup", {
      method: "POST",
      body: JSON.stringify(signupData),
    });
  },

  logout: async () => {
    return authApiRequest("/api/lecturer/logout", {
      method: "POST",
    });
  },
  me: async () => {
    return authApiRequest<any>("/api/lecturer/me", {
      method: "GET",
    });
  },
};