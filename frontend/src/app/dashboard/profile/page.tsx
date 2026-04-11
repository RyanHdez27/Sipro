"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  getActiveSessions,
  getCurrentUser,
  getCurrentUserProfile,
  getCurrentUserSecurity,
  revokeAllSessions,
  revokeSession,
  updateCurrentUser,
  updateCurrentUserSecurity,
  updateCurrentUserProfile,
} from "@/lib/api";
import type { ActiveSession } from "@/lib/api";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  User, Lock, Shield, Save, Camera, Home, TrendingUp,
  CheckCircle2, AlertCircle, Trophy, Flame, Clock, BarChart3,
  Calendar, Activity, Star, Globe
} from "lucide-react";

const evolucionPuntajes = [
  { fecha: "15/01", puntaje: 180 }, { fecha: "22/01", puntaje: 195 }, { fecha: "29/01", puntaje: 210 },
  { fecha: "05/02", puntaje: 225 }, { fecha: "12/02", puntaje: 240 }, { fecha: "19/02", puntaje: 255 }, { fecha: "26/02", puntaje: 270 },
];

const rendimientoPorArea = [
  { area: "Lectura Crítica", puntaje: 65, promedio: 70 },
  { area: "Razonamiento", puntaje: 82, promedio: 75 },
  { area: "Ciudadanas", puntaje: 78, promedio: 72 },
  { area: "Inglés", puntaje: 88, promedio: 80 },
];

const historialSimulacros = [
  { id: 1, fecha: "26/02/2026", puntaje: 270, duracion: "3h 45m" },
  { id: 2, fecha: "19/02/2026", puntaje: 255, duracion: "3h 30m" },
  { id: 3, fecha: "12/02/2026", puntaje: 240, duracion: "3h 50m" },
  { id: 4, fecha: "05/02/2026", puntaje: 225, duracion: "3h 20m" },
];

function ConfiguracionEstudiante() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [carrera, setCarrera] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [semestre, setSemestre] = useState("1");
  const puntajeActual = 270;
  const progresoGeneral = 75;
  const [objetivoPuntaje, setObjetivoPuntaje] = useState("300");
  const [frecuenciaPractica, setFrecuenciaPractica] = useState("semanal");
  const [dificultadPreferida, setDificultadPreferida] = useState("intermedio");
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [guardandoPerfil, setGuardandoPerfil] = useState(false);
  const [guardandoPreferencias, setGuardandoPreferencias] = useState(false);
  const [actualizandoPassword, setActualizandoPassword] = useState(false);
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  const [exitoPerfil, setExitoPerfil] = useState<string | null>(null);
  const [errorPassword, setErrorPassword] = useState<string | null>(null);
  const [exitoPassword, setExitoPassword] = useState<string | null>(null);
  const [guardandoTwoFactor, setGuardandoTwoFactor] = useState(false);
  const [errorTwoFactor, setErrorTwoFactor] = useState<string | null>(null);
  const [exitoTwoFactor, setExitoTwoFactor] = useState<string | null>(null);
  const [sesionesActivas, setSesionesActivas] = useState<ActiveSession[]>([]);
  const [errorSesiones, setErrorSesiones] = useState<string | null>(null);
  const [accionSesionEnCurso, setAccionSesionEnCurso] = useState<string | null>(null);
  const [accionMasivaSesiones, setAccionMasivaSesiones] = useState(false);
  const [exitoSesiones, setExitoSesiones] = useState<string | null>(null);

  const logros = [
    { nombre: "Constante", descripcion: "7 días seguidos practicando", Icon: Flame, color: "#F97316", desbloqueado: true },
    { nombre: "Mejora Continua", descripcion: "+50 puntos en un mes", Icon: TrendingUp, color: "#10B981", desbloqueado: true },
    { nombre: "Top 10%", descripcion: "Entre los mejores estudiantes", Icon: Trophy, color: "#7C3AED", desbloqueado: false },
    { nombre: "Experto", descripcion: "100 simulacros completados", Icon: Star, color: "#1D4ED8", desbloqueado: false },
  ];

  const areaDebil = rendimientoPorArea.find((area) => area.puntaje < area.promedio);
  const recomendacion = areaDebil
    ? { texto: `Refuerza ${areaDebil.area} - bajo rendimiento detectado`, color: "#F97316", Icon: AlertCircle }
    : { texto: "Excelente trabajo. Mantén el ritmo en todas las áreas", color: "#10B981", Icon: CheckCircle2 };
  const progresoObjetivo = Math.min(100, Math.round((puntajeActual / Number(objetivoPuntaje)) * 100));
  const puntosRestantes = Math.max(0, Number(objetivoPuntaje) - puntajeActual);

  useEffect(() => {
    let isMounted = true;

    const cargarPerfil = async () => {
      setCargandoPerfil(true);
      setErrorPerfil(null);
      try {
        const [user, profile, security, sessions] = await Promise.all([
          getCurrentUser(),
          getCurrentUserProfile(),
          getCurrentUserSecurity(),
          getActiveSessions(),
        ]);
        if (!isMounted) return;

        setNombre(user.name || "");
        setEmail(user.email || "");
        setTelefono(user.phone || "");
        setAvatarUrl(user.avatar_url || "");

        setCarrera(profile.career || "");
        setUniversidad(profile.university || "");
        setSemestre(profile.semester || "1");
        setObjetivoPuntaje(profile.objective_score ? String(profile.objective_score) : "300");
        setFrecuenciaPractica(profile.practice_frequency || "semanal");
        setDificultadPreferida(profile.preferred_difficulty || "intermedio");
        setTwoFactorEnabled(Boolean(security.two_factor_enabled));
        setSesionesActivas(sessions);
        setErrorSesiones(null);
      } catch (error) {
        if (!isMounted) return;
        setErrorPerfil(error instanceof Error ? error.message : "No se pudo cargar tu perfil desde el servidor.");
        setErrorSesiones("No se pudieron cargar las sesiones activas.");
      } finally {
        if (isMounted) setCargandoPerfil(false);
      }
    };

    cargarPerfil();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleGuardarPerfil = async () => {
    setGuardandoPerfil(true);
    setErrorPerfil(null);
    setExitoPerfil(null);
    try {
      await Promise.all([
        updateCurrentUser({
          name: nombre.trim(),
          email: email.trim(),
          phone: telefono.trim() || undefined,
          avatar_url: avatarUrl.trim() || undefined,
        }),
        updateCurrentUserProfile({
          career: carrera.trim() || undefined,
          university: universidad.trim() || undefined,
          semester: semestre,
        }),
      ]);
      setExitoPerfil("Perfil actualizado correctamente.");
    } catch (error) {
      setErrorPerfil(error instanceof Error ? error.message : "No se pudo guardar el perfil.");
    } finally {
      setGuardandoPerfil(false);
    }
  };

  const handleGuardarPreferencias = async () => {
    setGuardandoPreferencias(true);
    setErrorPerfil(null);
    setExitoPerfil(null);
    try {
      await updateCurrentUserProfile({
        objective_score: Number(objetivoPuntaje),
        practice_frequency: frecuenciaPractica,
        preferred_difficulty: dificultadPreferida,
      });
      setExitoPerfil("Objetivos y preferencias guardados correctamente.");
    } catch (error) {
      setErrorPerfil(error instanceof Error ? error.message : "No se pudieron guardar las preferencias.");
    } finally {
      setGuardandoPreferencias(false);
    }
  };

  const handleCambiarPassword = async () => {
    setErrorPassword(null);
    setExitoPassword(null);
    if (!passwordActual.trim()) {
      setErrorPassword("Ingresa tu contraseña actual.");
      return;
    }
    if (passwordNueva !== passwordConfirmar) {
      setErrorPassword("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
    if (passwordNueva.length < 6) {
      setErrorPassword("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setActualizandoPassword(true);
    try {
      await updateCurrentUser({ password: passwordNueva });
      setExitoPassword("Contraseña actualizada correctamente.");
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirmar("");
    } catch (error) {
      setErrorPassword(error instanceof Error ? error.message : "No se pudo actualizar la contraseña.");
    } finally {
      setActualizandoPassword(false);
    }
  };

  const handleGuardarTwoFactor = async () => {
    setErrorTwoFactor(null);
    setExitoTwoFactor(null);
    setGuardandoTwoFactor(true);
    try {
      const data = await updateCurrentUserSecurity({ two_factor_enabled: twoFactorEnabled });
      setTwoFactorEnabled(Boolean(data.two_factor_enabled));
      setExitoTwoFactor(
        data.two_factor_enabled
          ? "2FA activado. En el proximo inicio de sesion se solicitara OTP por correo."
          : "2FA desactivado correctamente."
      );
    } catch (error) {
      setErrorTwoFactor(error instanceof Error ? error.message : "No se pudo actualizar el estado de 2FA.");
    } finally {
      setGuardandoTwoFactor(false);
    }
  };

  const recargarSesiones = async () => {
    try {
      const sessions = await getActiveSessions();
      setSesionesActivas(sessions);
      setErrorSesiones(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : "No se pudieron actualizar las sesiones activas.";
      setErrorSesiones(message);
      throw error;
    }
  };

  const formatearFechaSesion = (rawDate: string | null | undefined) => {
    if (!rawDate) return "Sin actividad reciente";
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return "Fecha no disponible";
    return date.toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const resumirDispositivo = (userAgent: string | null | undefined) => {
    if (!userAgent) return "Dispositivo desconocido";
    const normalized = userAgent.toLowerCase();
    const browser = normalized.includes("edg/")
      ? "Microsoft Edge"
      : normalized.includes("chrome/")
      ? "Google Chrome"
      : normalized.includes("firefox/")
      ? "Mozilla Firefox"
      : normalized.includes("safari/") && !normalized.includes("chrome/")
      ? "Safari"
      : "Navegador";

    const os = normalized.includes("iphone") || normalized.includes("ipad")
      ? "iOS"
      : normalized.includes("windows")
      ? "Windows"
      : normalized.includes("mac os x")
      ? "macOS"
      : normalized.includes("android")
      ? "Android"
      : "SO desconocido";

    return `${browser} en ${os}`;
  };

  const handleCerrarSesion = async (sessionId: string, isCurrent: boolean) => {
    setErrorSesiones(null);
    setExitoSesiones(null);
    setAccionSesionEnCurso(sessionId);
    try {
      const result = await revokeSession(sessionId);
      if (result.was_current || isCurrent) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }
      await recargarSesiones();
      setExitoSesiones("Sesión cerrada correctamente.");
    } catch (error) {
      setErrorSesiones(error instanceof Error ? error.message : "No se pudo cerrar la sesión.");
    } finally {
      setAccionSesionEnCurso(null);
    }
  };

  const handleCerrarTodasLasSesiones = async () => {
    setErrorSesiones(null);
    setExitoSesiones(null);
    setAccionMasivaSesiones(true);
    try {
      const result = await revokeAllSessions();
      if (result.current_session_revoked) {
        localStorage.removeItem("token");
        router.push("/auth/login");
        return;
      }
      await recargarSesiones();
      setExitoSesiones(`Se cerraron ${result.revoked_count} sesiones activas.`);
    } catch (error) {
      setErrorSesiones(error instanceof Error ? error.message : "No se pudieron cerrar las sesiones.");
    } finally {
      setAccionMasivaSesiones(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div data-tour="config-header" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-bold text-2xl">Configuración y Perfil</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Personaliza tu experiencia de aprendizaje</p>
              </div>
            </div>
            <Button data-tour="config-home" variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800" title="Volver al inicio"><Home className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList data-tour="config-tabs" className="grid w-full grid-cols-3 lg:w-[450px] dark:bg-slate-800">
            <TabsTrigger value="perfil"><User className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Perfil</span></TabsTrigger>
            <TabsTrigger value="progreso"><BarChart3 className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Progreso</span></TabsTrigger>
            <TabsTrigger value="seguridad"><Shield className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Seguridad</span></TabsTrigger>
          </TabsList>

          {/* ─── PERFIL ─── */}
          <TabsContent data-tour="config-content" value="perfil">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-blue-700" />Perfil del Estudiante</CardTitle>
                <CardDescription>Gestiona tu información personal y académica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {cargandoPerfil && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    Cargando perfil...
                  </div>
                )}
                {errorPerfil && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorPerfil}
                  </div>
                )}
                {exitoPerfil && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {exitoPerfil}
                  </div>
                )}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="bg-blue-700 text-white text-2xl">
                      {nombre
                        .split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((chunk) => chunk[0]?.toUpperCase())
                        .join("") || "ST"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700"><Camera className="h-4 w-4" />Cambiar Foto</Button>
                    <p className="text-xs text-gray-500">JPG, PNG o GIF. Máx 2MB.</p>
                    <Input
                      placeholder="URL del avatar (opcional)"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="dark:bg-slate-800 dark:border-gray-700"
                    />
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2"><Label>Nombre Completo</Label><Input value={nombre} onChange={e => setNombre(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" disabled={cargandoPerfil} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" disabled={cargandoPerfil} /></div>
                  <div className="space-y-2"><Label>Teléfono</Label><Input value={telefono} onChange={e => setTelefono(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" placeholder="+57 300 000 0000" disabled={cargandoPerfil} /></div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Información Académica</h3>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Universidad</Label><Input value={universidad} onChange={e => setUniversidad(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" disabled={cargandoPerfil} /></div>
                    <div className="space-y-2"><Label>Carrera</Label><Input value={carrera} onChange={e => setCarrera(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" disabled={cargandoPerfil} /></div>
                    <div className="space-y-2">
                      <Label>Semestre Actual</Label>
                      <Select value={semestre} onValueChange={setSemestre} disabled={cargandoPerfil}>
                        <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                        <SelectContent>{[1,2,3,4,5,6,7,8,9,10].map(s => <SelectItem key={s} value={s.toString()}>{s}° Semestre</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between"><Label className="text-base">Progreso General</Label><span className="text-2xl font-bold text-blue-700">{progresoGeneral}%</span></div>
                  <Progress value={progresoGeneral} className="h-3" />
                  <p className="text-sm text-gray-500">¡Excelente progreso! Continúa así para alcanzar tus objetivos.</p>
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleGuardarPerfil} disabled={guardandoPerfil || cargandoPerfil} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"><Save className="h-4 w-4" />{guardandoPerfil ? "Guardando..." : "Guardar Cambios"}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── PROGRESO ─── */}
          <TabsContent value="progreso" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-yellow-500" />Logros y Reconocimientos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {logros.map(({ nombre, descripcion, Icon, color, desbloqueado }, i) => (
                    <div key={i} className={`p-4 border-2 rounded-lg text-center transition-all ${!desbloqueado ? "border-dashed border-gray-300 dark:border-gray-700 opacity-50" : "shadow-sm"}`} style={{ backgroundColor: desbloqueado ? `${color}15` : undefined, borderColor: desbloqueado ? `${color}40` : undefined }}>
                      <div className="flex justify-center mb-2">
                        <div className="p-3 rounded-full" style={{ backgroundColor: desbloqueado ? color : "#E5E7EB" }}>
                          <Icon className="h-6 w-6" style={{ color: desbloqueado ? "white" : "#9CA3AF" }} />
                        </div>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{nombre}</h4>
                      <p className="text-xs text-gray-500">{descripcion}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card data-tour="config-motivation" className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-blue-700" />Objetivos y Recomendaciones</CardTitle>
                <CardDescription>Ajusta tu meta y revisa en qué enfocarte en tu próxima práctica</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Objetivo de puntaje</Label>
                        <Select value={objetivoPuntaje} onValueChange={setObjetivoPuntaje} disabled={cargandoPerfil}>
                          <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="250">250 puntos</SelectItem>
                            <SelectItem value="275">275 puntos</SelectItem>
                            <SelectItem value="300">300 puntos</SelectItem>
                            <SelectItem value="325">325 puntos</SelectItem>
                            <SelectItem value="350">350+ puntos</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Puntaje actual:</span>
                          <span className="font-bold text-emerald-600">{puntajeActual} puntos</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700 dark:text-slate-200">Progreso hacia la meta</span>
                          <span className="font-semibold text-blue-700 dark:text-blue-300">{progresoObjetivo}%</span>
                        </div>
                        <Progress value={progresoObjetivo} className="h-3" />
                        <p className="text-sm text-gray-500">
                          {puntosRestantes > 0
                            ? `Te faltan ${puntosRestantes} puntos para alcanzar tu objetivo actual.`
                            : "Ya alcanzaste tu objetivo actual. Puedes subir la meta para seguir avanzando."}
                        </p>
                      </div>
                    </div>

                    <Separator className="dark:border-gray-800" />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Frecuencia de práctica</Label>
                        <Select value={frecuenciaPractica} onValueChange={setFrecuenciaPractica} disabled={cargandoPerfil}>
                          <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diaria">Diaria</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                            <SelectItem value="quincenal">Quincenal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Dificultad preferida</Label>
                        <Select value={dificultadPreferida} onValueChange={setDificultadPreferida} disabled={cargandoPerfil}>
                          <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basico">Básico</SelectItem>
                            <SelectItem value="intermedio">Intermedio</SelectItem>
                            <SelectItem value="avanzado">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div
                      className="rounded-xl border p-5 dark:bg-slate-800/40"
                      style={{ borderColor: `${recomendacion.color}50`, backgroundColor: `${recomendacion.color}12` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full p-2" style={{ backgroundColor: recomendacion.color }}>
                          <recomendacion.Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-semibold" style={{ color: recomendacion.color }}>Recomendación principal</p>
                          <p className="text-sm text-slate-700 dark:text-slate-200">{recomendacion.texto}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <Clock className="h-4 w-4 text-blue-700" />
                          Ritmo sugerido
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Mantén una práctica {frecuenciaPractica} y prioriza simulacros de nivel {dificultadPreferida}.
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950/40">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          <Globe className="h-4 w-4 text-emerald-500" />
                          Contexto académico
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                          Perfil configurado para {carrera} en {universidad}, semestre {semestre}.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button onClick={handleGuardarPreferencias} disabled={guardandoPreferencias || cargandoPerfil} className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    {guardandoPreferencias ? "Guardando..." : "Guardar Objetivos"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-emerald-500" />Evolución de Puntajes</CardTitle>
                <CardDescription>Tu progreso en los últimos simulacros</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={evolucionPuntajes}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="fecha" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 400]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
                    <Legend />
                    <Line type="monotone" dataKey="puntaje" stroke="#1D4ED8" strokeWidth={3} dot={{ fill: "#1D4ED8", r: 6 }} activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                  <p className="text-sm font-medium text-emerald-500">✓ Tendencia positiva: +90 puntos en el último mes</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-violet-600" />Rendimiento por Área</CardTitle>
                <CardDescription>Comparación con el promedio general</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rendimientoPorArea}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="area" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "8px" }} />
                    <Legend />
                    <Bar dataKey="puntaje" fill="#7C3AED" radius={[8, 8, 0, 0]} name="Tu puntaje" />
                    <Bar dataKey="promedio" fill="#10B981" radius={[8, 8, 0, 0]} name="Promedio" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="grid sm:grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /><h4 className="font-semibold text-emerald-500">Fortalezas</h4></div>
                    <ul className="space-y-1 text-sm">
                      {rendimientoPorArea.filter(a => a.puntaje >= a.promedio).map((a, i) => <li key={i}>• {a.area} ({a.puntaje}%)</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-2 mb-2"><AlertCircle className="h-5 w-5 text-orange-500" /><h4 className="font-semibold text-orange-500">Áreas a Mejorar</h4></div>
                    <ul className="space-y-1 text-sm">
                      {rendimientoPorArea.filter(a => a.puntaje < a.promedio).map((a, i) => <li key={i}>• {a.area} (-{a.promedio - a.puntaje}% vs promedio)</li>)}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-blue-700" />Historial de Simulacros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historialSimulacros.map(s => (
                    <div key={s.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-700 dark:hover:border-blue-500 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-700 rounded-lg"><CheckCircle2 className="h-5 w-5 text-white" /></div>
                        <div>
                          <p className="font-semibold">Simulacro Completo</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{s.fecha}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{s.duracion}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right"><div className="text-2xl font-bold text-emerald-500">{s.puntaje}</div><div className="text-xs text-gray-500">puntos</div></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SEGURIDAD ─── */}
          <TabsContent value="seguridad" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-blue-700" />Cambiar Contraseña</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorPassword && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorPassword}
                  </div>
                )}
                {exitoPassword && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {exitoPassword}
                  </div>
                )}
                <div className="space-y-2"><Label>Contraseña Actual</Label><Input type="password" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="space-y-2"><Label>Nueva Contraseña</Label><Input type="password" value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="space-y-2"><Label>Confirmar Nueva Contraseña</Label><Input type="password" value={passwordConfirmar} onChange={e => setPasswordConfirmar(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="flex justify-end pt-2"><Button onClick={handleCambiarPassword} disabled={actualizandoPassword} className="bg-blue-700 hover:bg-blue-800">{actualizandoPassword ? "Actualizando..." : "Actualizar Contraseña"}</Button></div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-violet-600" />Autenticación en Dos Factores (2FA)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorTwoFactor && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorTwoFactor}
                  </div>
                )}
                {exitoTwoFactor && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {exitoTwoFactor}
                  </div>
                )}
                <div className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-800 dark:bg-violet-900/10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1 pr-2">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Protección con doble factor</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Cuando esté activo, se solicitará un código OTP enviado al correo en cada inicio de sesión.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 self-end sm:self-auto">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${twoFactorEnabled ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200"}`}>
                        {twoFactorEnabled ? "Activo" : "Inactivo"}
                      </span>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} disabled={cargandoPerfil || guardandoTwoFactor} />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[auto_180px] sm:justify-end">
                  <Button
                    onClick={() => {
                      setTwoFactorEnabled((prev) => !prev);
                      setErrorTwoFactor(null);
                      setExitoTwoFactor(null);
                    }}
                    variant="outline"
                    disabled={cargandoPerfil || guardandoTwoFactor}
                    className="h-10 border-violet-300 text-violet-700 hover:bg-violet-50 dark:border-violet-700 dark:text-violet-300 dark:hover:bg-violet-900/20"
                  >
                    Cambiar estado
                  </Button>
                  <Button onClick={handleGuardarTwoFactor} disabled={cargandoPerfil || guardandoTwoFactor} className="h-10 bg-violet-600 hover:bg-violet-700">
                    {guardandoTwoFactor ? "Guardando..." : "Guardar 2FA"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-emerald-500" />Sesiones Activas</CardTitle>
                <CardDescription>Gestiona tus dispositivos conectados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {errorSesiones && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {errorSesiones}
                  </div>
                )}
                {exitoSesiones && (
                  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                    {exitoSesiones}
                  </div>
                )}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-300">
                  <span>Se muestran sesiones con actividad reciente y sin revocar.</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void recargarSesiones()}
                    disabled={cargandoPerfil || accionMasivaSesiones || Boolean(accionSesionEnCurso)}
                    className="h-8 px-2 text-slate-700 hover:bg-slate-200 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Actualizar
                  </Button>
                </div>
                {cargandoPerfil ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-700">
                    Cargando sesiones activas...
                  </div>
                ) : sesionesActivas.length === 0 ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300">
                    No se encontraron sesiones activas en este momento.
                  </div>
                ) : (
                  <div className="max-h-[320px] space-y-3 overflow-y-auto pr-1">
                    {sesionesActivas.map((session) => {
                      const ultimaActividad = formatearFechaSesion(session.last_seen_at);
                      const inicioSesion = formatearFechaSesion(session.created_at);
                      return (
                        <div
                          key={session.session_id}
                          className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-slate-50 p-4 dark:border-gray-800 dark:bg-slate-800/70 sm:flex-row sm:items-start sm:justify-between"
                        >
                          <div className="min-w-0 space-y-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-slate-800 dark:text-slate-100">{resumirDispositivo(session.user_agent)}</p>
                              {session.is_current && (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300"
                                >
                                  Actual
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">IP: {session.ip || "No disponible"}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Última actividad: {ultimaActividad}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Inicio de sesión: {inicioSesion}</p>
                          </div>
                          <div className="flex w-full shrink-0 justify-end sm:w-auto">
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={accionMasivaSesiones || accionSesionEnCurso === session.session_id}
                              onClick={() => void handleCerrarSesion(session.session_id, session.is_current)}
                              className="text-orange-600 hover:bg-orange-50 hover:text-orange-700 dark:hover:bg-orange-900/20"
                            >
                              {accionSesionEnCurso === session.session_id
                                ? "Cerrando..."
                                : session.is_current
                                ? "Cerrar esta sesión"
                                : "Cerrar"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Separator className="dark:border-gray-800" />
                <Button
                  variant="outline"
                  disabled={cargandoPerfil || sesionesActivas.length === 0 || accionMasivaSesiones || Boolean(accionSesionEnCurso)}
                  onClick={() => void handleCerrarTodasLasSesiones()}
                  className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 disabled:opacity-60 dark:hover:bg-orange-900/20"
                >
                  {accionMasivaSesiones ? "Cerrando sesiones..." : "Cerrar sesión en todos los dispositivos"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function DashboardProfilePage() {
  return (
    <ProtectedRoute>
      <ConfiguracionEstudiante />
    </ProtectedRoute>
  );
}
