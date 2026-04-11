/* eslint-disable */
// @ts-nocheck
"use client";

export { default } from "./LoginPageOtp";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { getCurrentUser, loginUser, resendTwoFactorLoginCode, verifyTwoFactorLogin } from "@/lib/api";

export function LegacyLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [otpToken, setOtpToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpMessage, setOtpMessage] = useState("");
  const [resendingOtp, setResendingOtp] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un correo institucional válido.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.access_token);
      
      // Obtener el perfil del usuario utilizando el token guardado
      const user = await getCurrentUser();
      
      // Analizar el rol para redirigir a la vista correspondiente
      const rolUsuario = user.role?.toLowerCase() || user.rol?.toLowerCase();
      
      if (rolUsuario === "admin" || rolUsuario === "administrador") {
        router.push("/admin");
      } else if (rolUsuario === "profesor" || rolUsuario === "docente") {
        router.push("/profesor");
      } else {
        router.push("/dashboard"); // Estudiantes
      }
    } catch (err: any) {
      setError(err.message || "Falla de conexión al servidor. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Lado izquierdo - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-blue-700">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Tutor Virtual</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Preparación con IA para Saber Pro
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Aprende de forma inteligente con nuestro sistema multiagente que se adapta a tu nivel.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Pruebas Simuladas</h3>
                <p className="text-blue-100">Practica con exámenes tipo Saber Pro</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Tutor IA Personalizado</h3>
                <p className="text-blue-100">Asistente inteligente disponible 24/7</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg">Análisis de Competencias</h3>
                <p className="text-blue-100">Identifica tus fortalezas y áreas de mejora</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de Login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            {/* Logo para móvil */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-700">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Tutor Virtual</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
              <p className="text-gray-500 dark:text-gray-400">Ingresa tus credenciales institucionales para continuar</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Correo Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    placeholder="tu@unicartagena.edu.co"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={mostrarPassword ? "text" : "password"}
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-transparent"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Recordarme</span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push("/auth/reset-password")}
                  className="text-sm font-medium hover:underline text-blue-600"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-blue-700"
              >
                {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                ¿No tienes una cuenta?{" "}
                <button
                  onClick={() => router.push("/auth/register")}
                  className="font-semibold hover:underline text-blue-600"
                >
                  Regístrate aquí
                </button>
              </p>
            </div>
            
            {/* Se removieron los botones de Google y Facebook según requerimiento */}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            Al continuar, aceptas nuestros{" "}
            <a href="#" className="hover:underline text-blue-600">Términos de Servicio</a>
            {" "}y{" "}
            <a href="#" className="hover:underline text-blue-600">Política de Privacidad</a>
          </p>
        </div>
      </div>
    </div>
  );
}
