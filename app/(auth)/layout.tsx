import Sidebar from "@/components/Sidebar";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="h-screen relative justify-center">
       {children}
      </div>
  );
}
