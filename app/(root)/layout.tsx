"use client"
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

export default function layout({ children }: { children: React.ReactNode }) {
  const { lecturer } = useAuth();
  return (
    <div className="h-screen relative">
      <Sidebar />
      <main
        className={cn(" pt-0 min-h-screen", !lecturer ? "md:pl-0" : "md:pl-64")}
      >
        <div className={cn("mx-auto", !lecturer ? "w-full" : "max-w-6xl")}>{children}</div>
      </main>
    </div>
  );
}
