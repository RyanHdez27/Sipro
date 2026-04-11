"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getCurrentUser, updateCurrentUser, getProfesorStats } from "@/lib/api";
import {
  User, Lock, Settings, Shield, Save, Camera, Home, Users, GraduationCap, Loader2
} from "lucide-react";

function ConfiguracionDocente() {
  const router = useRouter();

  // Perfil
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Cuenta
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Stats
  const [totalEstudiantes, setTotalEstudiantes] = useState<number | null>(null);
  const [totalCarreras, setTotalCarreras] = useState<number | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Iniciales para avatar
  const initials = nombre
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "JP";

  useEffect(() => {
    // Cargar datos del usuario
    getCurrentUser()
      .then((user) => {
        setNombre(user.name || "");
        setEmail(user.email || "");
      })
      .catch(() => {});

    // Cargar estadísticas
    getProfesorStats()
      .then((stats) => {
        setTotalEstudiantes(stats.total_estudiantes);
        // Contar carreras únicas (excluye "Sin asignar")
        const carrerasUnicas = stats.distribucion_carreras.filter(
          (d) => d.carrera !== "Sin asignar"
        ).length;
        setTotalCarreras(carrerasUnicas);
      })
      .catch(() => {
        // Reintentar una vez tras 1.5s por si el token aún no estaba listo
        setTimeout(() => {
          getProfesorStats()
            .then((stats) => {
              setTotalEstudiantes(stats.total_estudiantes);
              const carrerasUnicas = stats.distribucion_carreras.filter(
                (d) => d.carrera !== "Sin asignar"
              ).length;
              setTotalCarreras(carrerasUnicas);
            })
            .catch(() => {
              setTotalEstudiantes(null);
              setTotalCarreras(null);
            });
        }, 1500);
      })
      .finally(() => setLoadingStats(false));
  }, []);

  const handleGuardarPerfil = async () => {
    setSaving(true);
    setSaveMsg("");
    try {
      await updateCurrentUser({ name: nombre });
      setSaveMsg("✓ Cambios guardados correctamente");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err: any) {
      setSaveMsg("Error al guardar: " + (err.message || "Inténtalo de nuevo"));
    } finally {
      setSaving(false);
    }
  };

  const handleCambiarPassword = () => {
    if (passwordNueva !== passwordConfirmar) return;
    if (passwordNueva.length < 6) return;
    setPasswordActual("");
    setPasswordNueva("");
    setPasswordConfirmar("");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div data-tour="config-header" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-2xl">Configuración y Perfil</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Administra tu cuenta y preferencias</p>
            </div>
            <Button
              data-tour="config-home"
              variant="ghost"
              size="icon"
              onClick={() => router.push("/profesor")}
              className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Volver al inicio"
            >
              <Home className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          {/* Solo 2 pestañas: Perfil y Cuenta */}
          <TabsList data-tour="config-tabs" className="grid w-full grid-cols-2 lg:w-[400px] dark:bg-slate-800">
            <TabsTrigger value="perfil">
              <User className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="cuenta">
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Cuenta</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── PERFIL ─── */}
          <TabsContent data-tour="config-content" value="perfil">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-700" />
                  Perfil del Docente
                </CardTitle>
                <CardDescription>Gestiona tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-700 text-white text-2xl">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700">
                      <Camera className="h-4 w-4" />
                      Cambiar Foto
                    </Button>
                    <p className="text-xs text-gray-500">JPG, PNG o GIF. Máx 2MB.</p>
                  </div>
                </div>

                <Separator className="dark:border-gray-800" />

                {/* Nombre y Email */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="dark:bg-slate-800 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={email}
                      disabled
                      className="dark:bg-slate-800 dark:border-gray-700 opacity-60 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400">El email no puede modificarse desde aquí.</p>
                  </div>
                </div>

                <Separator className="dark:border-gray-800" />

                {/* Tarjetas de estadísticas */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-blue-700 rounded-lg shrink-0">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Estudiantes</p>
                      {loadingStats ? (
                        <Loader2 className="h-5 w-5 animate-spin text-blue-700 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{totalEstudiantes ?? "—"}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-emerald-500 rounded-lg shrink-0">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Carreras Registradas</p>
                      {loadingStats ? (
                        <Loader2 className="h-5 w-5 animate-spin text-emerald-500 mt-1" />
                      ) : (
                        <p className="text-2xl font-bold">{totalCarreras ?? "—"}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Feedback guardado */}
                {saveMsg && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    saveMsg.startsWith("✓")
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
                      : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800"
                  }`}>
                    {saveMsg}
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={handleGuardarPerfil}
                    disabled={saving}
                    className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {saving ? "Guardando..." : "Guardar Cambios"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── CUENTA ─── */}
          <TabsContent value="cuenta" className="space-y-6">
            {/* Cambiar contraseña */}
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-700" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>Mantén tu cuenta segura con una contraseña fuerte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Contraseña Actual</Label>
                  <Input
                    type="password"
                    value={passwordActual}
                    onChange={(e) => setPasswordActual(e.target.value)}
                    placeholder="••••••••"
                    className="dark:bg-slate-800 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={passwordNueva}
                    onChange={(e) => setPasswordNueva(e.target.value)}
                    placeholder="••••••••"
                    className="dark:bg-slate-800 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmar Nueva Contraseña</Label>
                  <Input
                    type="password"
                    value={passwordConfirmar}
                    onChange={(e) => setPasswordConfirmar(e.target.value)}
                    placeholder="••••••••"
                    className="dark:bg-slate-800 dark:border-gray-700"
                  />
                </div>
                {passwordNueva && passwordConfirmar && passwordNueva !== passwordConfirmar && (
                  <p className="text-sm text-red-500">Las contraseñas no coinciden.</p>
                )}
                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleCambiarPassword}
                    disabled={!passwordActual || !passwordNueva || passwordNueva !== passwordConfirmar || passwordNueva.length < 6}
                    className="bg-blue-700 hover:bg-blue-800"
                  >
                    Actualizar Contraseña
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 2FA */}
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-violet-600" />
                  Autenticación en Dos Factores (2FA)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Activar 2FA</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Requiere código de verificación al iniciar sesión</div>
                  </div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
                {twoFactorEnabled && (
                  <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800">
                    <p className="text-sm text-violet-600 dark:text-violet-400 font-medium">✓ 2FA activado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2">
                <Save className="h-4 w-4" />
                Guardar Configuración
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ProfesorProfilePage() {
  return (
    <ProtectedRoute requiredRole="profesor">
      <ConfiguracionDocente />
    </ProtectedRoute>
  );
}
