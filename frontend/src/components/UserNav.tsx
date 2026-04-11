"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GuidedTour } from "@/components/GuidedTour";
import { 
  adminTourSteps, estudianteTourSteps, profesorTourSteps,
  adminConfigTourSteps, estudianteConfigTourSteps, profesorConfigTourSteps 
} from "@/lib/tourSteps";
import { HelpCircle } from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  avatar_url?: string;
  role?: string;
}

function getTourForRole(role: string, isConfig: boolean) {
  if (role === "admin") return isConfig ? adminConfigTourSteps : adminTourSteps;
  if (role === "profesor") return isConfig ? profesorConfigTourSteps : profesorTourSteps;
  return isConfig ? estudianteConfigTourSteps : estudianteTourSteps;
}

export function UserNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showTour, setShowTour] = useState(false);

  const basePath = user?.role === "admin" ? "admin" : user?.role === "profesor" ? "profesor" : "dashboard";
  const userRole = user?.role || "estudiante";
  const isConfigPage = pathname.endsWith("/profile");
  const storageKey = `sipro_tutorial_seen_${userRole}${isConfigPage ? "_config" : ""}`;

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) { router.push("/auth/login"); return; }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);

          // Auto-show tour for new users (after a small delay so DOM is ready)
          const seen = localStorage.getItem(`sipro_tutorial_seen_${data.role || "estudiante"}${isConfigPage ? "_config" : ""}`);
          if (!seen) {
            setTimeout(() => setShowTour(true), 1500);
          }
        } else {
          localStorage.removeItem("token");
          router.push("/auth/login");
        }
      } catch {
        console.error("Failed to fetch user data for nav");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button data-tour="user-nav" className="flex items-center gap-3 hover:opacity-80 outline-none">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name || "Cargando..."}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || (user?.role || "Estudiante")}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold overflow-hidden shadow-sm border border-border">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(`/${basePath}/profile`)} className="cursor-pointer">
            Configuración
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTour(true)} className="cursor-pointer">
            <HelpCircle className="w-4 h-4 mr-2" />Tutorial de uso
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
            Cerrar sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {showTour && (
        <GuidedTour
          steps={getTourForRole(userRole, isConfigPage)}
          storageKey={storageKey}
          onFinish={() => setShowTour(false)}
        />
      )}
    </>
  );
}
