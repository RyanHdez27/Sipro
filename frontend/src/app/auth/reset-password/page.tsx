"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Brain, Mail, KeyRound, ShieldCheck, RefreshCw } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email) {
      setError("Por favor ingresa tu correo institucional.");
      return;
    }

    if (!email.includes("@")) {
      setError("Por favor ingresa un correo institucional válido.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/auth/reset-password?email=${encodeURIComponent(email)}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        setMessage(data.msg || "Se ha enviado un enlace de recuperación a tu correo electrónico.");
      } else {
        const errData = await res.json();
        setError(errData.detail || "Error al solicitar la recuperación. Verifica tu correo e inténtalo de nuevo.");
      }
    } catch (err: any) {
      setError("Falla de conexión al servidor. Inténtalo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Lado izquierdo - Branding (Color distintivo VIOLETA) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-violet-700">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Tutor Virtual</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">
            Recupera tu Acceso
          </h2>
          <p className="text-xl text-violet-100 mb-8">
            Si olvidaste tu contraseña, no te preocupes. Hemos robustecido nuestro sistema para proteger tus datos de forma infalible.
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Protección Garantizada</h3>
                <p className="text-violet-100">Tu cuenta académica está segura tras nuestra verificación en 2 pasos.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Proceso Rápido</h3>
                <p className="text-violet-100">Recibe al instante las instrucciones en tu correo para volver al ruedo.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario de Restablecimiento */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            {/* Logo para móvil */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-violet-700">
                <KeyRound className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Tutor Virtual</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Restablecer Contraseña</h2>
              <p className="text-gray-500 dark:text-gray-400">Ingresa tu correo asociado para enviarte las instrucciones.</p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}
            
            {message && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">{message}</p>
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-6">
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
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 bg-transparent"
                    placeholder="tu@unicartagena.edu.co"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full py-6 text-lg font-semibold bg-violet-700 hover:bg-violet-800 text-white shadow-lg shadow-violet-700/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Enviando enlace...
                  </div>
                ) : (
                  "Enviarme Enlace"
                )}
              </Button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
              ¿Recordaste tu contraseña?{" "}
              <button
                onClick={() => router.push("/auth/login")}
                className="font-semibold text-violet-700 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors"
              >
                Volver a Iniciar Sesión
              </button>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>© 2026 SIPRO UDC. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
