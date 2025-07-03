import ProtectedRoute from "@/components/ProtectedRoute";

export default function layout({children}: {children: React.ReactNode}) {
  return (
    <ProtectedRoute>
        {children}
    </ProtectedRoute>
  )
}
