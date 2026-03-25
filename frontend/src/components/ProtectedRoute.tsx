"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "estudiante" | "profesor" | "admin";
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (requiredRole && user?.role !== requiredRole) {
        // Redirige al dashboard correcto basado en su rol
        const dest = user?.role === 'admin' ? '/admin' : user?.role === 'profesor' ? '/profesor' : '/dashboard';
        router.push(dest);
      } else if (!requiredRole && user?.role && user.role !== 'estudiante') {
        // Si no se requiere un rol especifico (ej. /dashboard) pero no es estudiante, redirigir
        const dest = user.role === 'admin' ? '/admin' : '/profesor';
        router.push(dest);
      }
    }
  }, [loading, isAuthenticated, requiredRole, user?.role, router]);

  if (loading || !isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
}
