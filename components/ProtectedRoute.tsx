"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { lecturer, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !lecturer) {
      router.replace("/login");
    }
  }, [lecturer, loading, router]);

  if (loading || (!lecturer && typeof window !== "undefined")) {
    return <div className="flex items-center justify-center h-screen">
        <Loader />
    </div>;
  }

  return <>{children}</>;
}
