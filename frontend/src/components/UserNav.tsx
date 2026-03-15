"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfile {
  name: string;
  email: string;
  avatar_url?: string;
}

export function UserNav() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  
  // Extract initial letters for avatar fallback
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  useEffect(() => {
    const fetchUser = async () => {
      // DEV BYPASS: Load mock user data if no token
      const token = localStorage.getItem("token");
      if (!token) {
        setUser({ name: "Usuario Pruebas", email: "pruebas@sipro.edu.co", avatar_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix" });
        return;
      }

      try {
        const res = await fetch("http://localhost:8000/users/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
             setUser({ name: "Usuario Pruebas", email: "pruebas@sipro.edu.co", avatar_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix" });
        }
      } catch (error) {
        console.error("Failed to fetch user data for nav");
        setUser({ name: "Usuario Pruebas", email: "pruebas@sipro.edu.co", avatar_url: "https://api.dicebear.com/7.x/notionists/svg?seed=Felix" });
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:opacity-80 outline-none">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{user?.name || "Cargando..."}</p>
            <p className="text-xs text-gray-500">Estudiante</p>
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
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard/profile")} className="cursor-pointer">
          Mi Perfil
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
          Configuración
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive focus:text-destructive-foreground">
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
