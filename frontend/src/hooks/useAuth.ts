"use client";
import { useState, useEffect } from "react";

export interface AuthContextData {
  name?: string;
  email?: string;
  role?: "estudiante" | "profesor" | "admin";
  exp?: number;
}

export function useAuth() {
  const [user, setUser] = useState<AuthContextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const checkSession = () => {
      const lastActivity = localStorage.getItem("last_activity");
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      // Si la inactividad supera los 5 minutos, expira la sesión de forma inmediata
      if (lastActivity && now - parseInt(lastActivity) > fiveMinutes) {
        return true; // Expirado
      }
      return false;
    };

    if (token) {
      if (checkSession()) {
        localStorage.removeItem("token");
        localStorage.removeItem("last_activity");
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("token");
          localStorage.removeItem("last_activity");
          setUser(null);
        } else {
          setUser({
            email: payload.sub,
            role: payload.role,
            exp: payload.exp,
          });
          // Renovar timestamp de actividad si no existe o es válido
          localStorage.setItem("last_activity", Date.now().toString());
        }
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const isStudent = user?.role === "estudiante";
  const isTeacher = user?.role === "profesor";
  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  // Effect para manejar eventos de inactividad de sesión
  useEffect(() => {
    if (!isAuthenticated) return;

    const resetTimer = () => {
      localStorage.setItem("last_activity", Date.now().toString());
    };

    // Actualizamos la actividad frente a las interacciones
    ["mousemove", "keydown", "scroll", "click"].forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Validamos continuamente cada 30 segundos si ha superado los 5 minutos de inactividad
    const interval = setInterval(() => {
      const lastActivity = localStorage.getItem("last_activity");
      if (lastActivity && Date.now() - parseInt(lastActivity) > 5 * 60 * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("last_activity");
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    }, 30000);

    return () => {
      ["mousemove", "keydown", "scroll", "click"].forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  return { user, loading, isAuthenticated, isStudent, isTeacher, isAdmin };
}
