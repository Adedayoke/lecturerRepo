// contexts/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { lecturerApi } from "@/lib/auth-api";
import { useRouter } from "next/navigation";

interface Lecturer {
  id: string; // Change from number to string to match your API
  pfNumber: string;
  title: string;
  firstName?: string;
  lastName?: string;
  email?: string; // Add email field
  courses?: Array<{
    id: number;
    courseCode: string;
    courseName: string;
  }>; // Match your API response structure
}

interface AuthContextType {
  lecturer: Lecturer | null;
  loading: boolean;
  lecturerLogout: () => Promise<void>;
  isAuthenticated: boolean;
  lecturerLogin: (username: string, password: string) => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [lecturer, setLecturer] = useState<Lecturer | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      
      // First, try to get lecturer info from the server using the cookie token
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // This ensures cookies are sent
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setLecturer(result.data);
          // Also store in localStorage for offline access
          localStorage.setItem("user", JSON.stringify(result.data));
          return;
        }
      }

      // If server request fails, try localStorage as fallback
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Validate that the user object has required properties
          if (parsedUser.id && parsedUser.pfNumber) {
            setLecturer(parsedUser);
          } else {
            localStorage.removeItem("user");
          }
        } catch {
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Auth check error:", error);
      setLecturer(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  const lecturerLogout = async () => {
    try {
      await lecturerApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear local state and storage
      setLecturer(null);
      localStorage.removeItem("user");
      router.push("/login?message=Logged out successfully");
    }
  };

  const lecturerLogin = async (username: string, password: string) => {
    try {
      const response = await lecturerApi.login(username, password);
      if (response.success) {
        setLecturer(response.data);
        console.log(response.data)
        localStorage.setItem("user", JSON.stringify(response.data));
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      throw error;
    }
  };


  const value: AuthContextType = {
    lecturer,
    loading,
    lecturerLogout,
    isAuthenticated: !!lecturer,
    lecturerLogin,
    refreshAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};