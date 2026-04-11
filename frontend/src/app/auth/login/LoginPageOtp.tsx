"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, Eye, EyeOff, GraduationCap, Lock, Mail, ShieldCheck, Clock3 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCurrentUser, loginUser, resendTwoFactorLoginCode, verifyTwoFactorLogin } from "@/lib/api";

export default function LoginPageOtp() {
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
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!requiresTwoFactor) return;

    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [requiresTwoFactor]);

  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const redirectByRole = async () => {
    const user = await getCurrentUser();
    const role = user.role?.toLowerCase();
    if (role === "admin" || role === "administrador") {
      router.push("/admin");
      return;
    }
    if (role === "profesor" || role === "docente") {
      router.push("/profesor");
      return;
    }
    router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    if (!email.includes("@")) {
      setError("Por favor ingresa un correo institucional valido.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.requires_2fa) {
        if (!data.otp_token) {
          throw new Error("No se recibio el token OTP de verificacion.");
        }
        setRequiresTwoFactor(true);
        setOtpToken(data.otp_token);
        setOtpCode("");
        setOtpMessage(data.message || "Ingresa el codigo OTP enviado a tu correo.");
        setRemainingSeconds(Math.max(0, data.expires_in_seconds ?? 0));
        return;
      }

      if (!data.access_token) {
        throw new Error("Respuesta de autenticacion incompleta.");
      }
      localStorage.setItem("token", data.access_token);
      await redirectByRole();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Falla de conexion al servidor. Intentalo mas tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!otpToken) {
      setError("Sesion OTP invalida. Inicia sesion de nuevo.");
      return;
    }
    if (otpCode.trim().length !== 6) {
      setError("Ingresa un codigo OTP de 6 digitos.");
      return;
    }

    setLoading(true);
    try {
      const data = await verifyTwoFactorLogin(otpToken, otpCode.trim());
      localStorage.setItem("token", data.access_token);
      await redirectByRole();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo validar el codigo OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!otpToken) {
      setError("No hay una sesion OTP activa. Inicia sesion nuevamente.");
      return;
    }
    setError("");
    setResendingOtp(true);
    try {
      const data = await resendTwoFactorLoginCode(otpToken);
      if (data.otp_token) {
        setOtpToken(data.otp_token);
      }
      setOtpCode("");
      setOtpMessage(data.message || "Te enviamos un nuevo codigo OTP.");
      setRemainingSeconds(Math.max(0, data.expires_in_seconds ?? 0));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "No se pudo reenviar el codigo OTP.");
    } finally {
      setResendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-12 bg-blue-700">
        <div className="max-w-md text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-white/20 backdrop-blur-sm">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Tutor Virtual</h1>
          </div>
          <h2 className="text-4xl font-bold mb-6">Preparacion con IA para Saber Pro</h2>
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
                <p className="text-blue-100">Practica con examenes tipo Saber Pro</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white/20 mt-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Acceso Seguro con 2FA</h3>
                <p className="text-blue-100">Verificacion OTP cuando el doble factor esta activo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="p-2 rounded-xl bg-blue-700">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold">Tutor Virtual</h1>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">
                {requiresTwoFactor ? "Verificacion en Dos Pasos" : "Iniciar Sesion"}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {requiresTwoFactor
                  ? otpMessage || "Ingresa el codigo OTP enviado a tu correo."
                  : "Ingresa tus credenciales institucionales para continuar"}
              </p>
              {requiresTwoFactor && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Clock3 className="h-4 w-4" />
                  {remainingSeconds > 0
                    ? `Codigo valido por ${formatTimeLeft(remainingSeconds)}`
                    : "Codigo vencido. Solicita uno nuevo."}
                </div>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {!requiresTwoFactor ? (
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
                    Contrasena
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
                      placeholder="********"
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

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity bg-blue-700"
                >
                  {loading ? "Iniciando sesion..." : "Iniciar Sesion"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label htmlFor="otp-code" className="block text-sm font-medium mb-2">
                    Codigo OTP (6 digitos)
                  </label>
                  <input
                    id="otp-code"
                    value={otpCode}
                    maxLength={6}
                    inputMode="numeric"
                    pattern="\d{6}"
                    autoComplete="one-time-code"
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="w-full py-3 px-4 text-center tracking-[0.5em] border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                    placeholder="000000"
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={resendingOtp || loading}
                    onClick={handleResendOtp}
                    className="w-full h-11"
                  >
                    {resendingOtp ? "Reenviando..." : "Reenviar Codigo"}
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || remainingSeconds <= 0}
                    className="w-full h-11 bg-blue-700 text-white"
                  >
                    {loading ? "Validando..." : "Validar Codigo"}
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  className="w-full h-10"
                  onClick={() => {
                    setRequiresTwoFactor(false);
                    setOtpToken("");
                    setOtpCode("");
                    setOtpMessage("");
                    setRemainingSeconds(0);
                    setError("");
                  }}
                >
                  Volver al inicio de sesion
                </Button>
              </form>
            )}

            {!requiresTwoFactor && (
              <div className="mt-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  No tienes una cuenta?{" "}
                  <button
                    onClick={() => router.push("/auth/register")}
                    className="font-semibold hover:underline text-blue-600"
                  >
                    Registrate aqui
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
