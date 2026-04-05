"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  generateTeacherCode, getTeacherCodes, revokeTeacherCode,
  adminRegisterTeacher, registerTeacher,
  getLoginLogs, clearLoginLogs,
} from "@/lib/api";
import {
  User, Shield, Key, Bell, Save, Camera, Home,
  Copy, Trash2, Clock, CheckCircle2, XCircle, AlertTriangle,
  Users, Activity, Lock, UserPlus, Mail, Monitor,
  LogIn, Send, Loader2
} from "lucide-react";

/* ───────── TYPES ───────── */
interface CodigoRegistro {
  code: string;
  created_at: string;
  expires_at: string;
  estado: string;
  used_by_name: string | null;
}
interface LogEntry {
  id: number; user_email: string; action: string; ip: string;
  user_agent: string; success: boolean; created_at: string;
}
interface Notificacion {
  id: number; asunto: string; mensaje: string; destinatarios: string; fecha: string;
}

/* ───────── HELPERS ───────── */
function diasRestantes(fechaExp: string): number {
  return Math.ceil((new Date(fechaExp).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

function parseUserAgent(ua: string): string {
  if (!ua || ua === "unknown") return "Desconocido";
  const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/)?.[0] || "Otro";
  const os = ua.match(/(Windows|Mac|Linux|Android|iPhone)/)?.[0] || "";
  return `${browser} / ${os}`;
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ═══════════════════════════════════════════════════════════════ */
function ConfiguracionAdmin() {
  const router = useRouter();

  /* Profile */
  const [nombre, setNombre] = useState("Admin Principal");
  const [email] = useState("admin@siproudc.com");
  const [rol] = useState("Super Admin");

  /* Codes — from backend */
  const [codigos, setCodigos] = useState<CodigoRegistro[]>([]);
  const [codigosLoading, setCodigosLoading] = useState(true);
  const [codigoCopiado, setCodigoCopiado] = useState<string | null>(null);
  const [generando, setGenerando] = useState(false);

  /* Teacher Registration */
  const [regNombre, setRegNombre] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regCodigo, setRegCodigo] = useState("");
  const [modoRegistro, setModoRegistro] = useState<"manual" | "codigo">("manual");
  const [regExito, setRegExito] = useState<string | null>(null);
  const [regError, setRegError] = useState<string | null>(null);
  const [registrando, setRegistrando] = useState(false);

  /* Security: Limits */
  const [maxEstudiantesPorDocente, setMaxEstudiantesPorDocente] = useState("200");
  const [maxMateriasPorDocente, setMaxMateriasPorDocente] = useState("10");

  /* Security: Logs — from backend */
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [filtroLog, setFiltroLog] = useState<"todos" | "acceso" | "alerta">("todos");

  /* Notifications (stays frontend-only) */
  const [notifMasivas, setNotifMasivas] = useState(true);
  const [alertasSistema, setAlertasSistema] = useState(true);
  const [notifAsunto, setNotifAsunto] = useState("");
  const [notifMensaje, setNotifMensaje] = useState("");
  const [historialNotif, setHistorialNotif] = useState<Notificacion[]>([]);
  const [notifExito, setNotifExito] = useState<string | null>(null);

  /* ─── LOAD DATA FROM BACKEND ─── */
  useEffect(() => {
    getTeacherCodes()
      .then(setCodigos).catch(() => {})
      .finally(() => setCodigosLoading(false));
    getLoginLogs()
      .then(setLogs).catch(() => {})
      .finally(() => setLogsLoading(false));
  }, []);

  /* Filtered logs */
  const logsFiltrados = useMemo(() => {
    if (filtroLog === "todos") return logs;
    if (filtroLog === "acceso") return logs.filter(l => l.success);
    return logs.filter(l => !l.success); // alerta = failed
  }, [logs, filtroLog]);

  /* ─── HANDLERS: ACCESOS ─── */
  const handleGenerarCodigo = async () => {
    setGenerando(true);
    try {
      await generateTeacherCode();
      const updated = await getTeacherCodes();
      setCodigos(updated);
    } catch { /* silent */ }
    setGenerando(false);
  };

  const handleCopiarCodigo = (codigo: string) => {
    navigator.clipboard.writeText(codigo);
    setCodigoCopiado(codigo);
    setTimeout(() => setCodigoCopiado(null), 2000);
  };

  const handleRevocarCodigo = async (codigo: string) => {
    try {
      await revokeTeacherCode(codigo);
      const updated = await getTeacherCodes();
      setCodigos(updated);
    } catch { /* silent */ }
  };

  const handleRegistrarDocente = async () => {
    setRegExito(null); setRegError(null);
    if (!regNombre.trim() || !regEmail.trim()) { setRegError("Nombre y email son obligatorios."); return; }

    setRegistrando(true);
    try {
      if (modoRegistro === "manual") {
        if (!regPassword.trim()) { setRegError("La contraseña es obligatoria."); setRegistrando(false); return; }
        await adminRegisterTeacher({ name: regNombre, email: regEmail, password: regPassword });
      } else {
        if (!regCodigo.trim()) { setRegError("El código es obligatorio."); setRegistrando(false); return; }
        await registerTeacher({ name: regNombre, email: regEmail, password: "TempPass123!", wants_newsletter: false, teacher_code: regCodigo.trim().toUpperCase() });
        // Refresh codes since one was consumed
        const updated = await getTeacherCodes();
        setCodigos(updated);
      }
      setRegExito(`Docente "${regNombre}" registrado exitosamente en la base de datos.`);
      setRegNombre(""); setRegEmail(""); setRegPassword(""); setRegCodigo("");
      setTimeout(() => setRegExito(null), 5000);
    } catch (err: any) {
      setRegError(err.message || "Error al registrar docente.");
    }
    setRegistrando(false);
  };

  /* ─── HANDLERS: SEGURIDAD ─── */
  const handleLimpiarLogs = async () => {
    try {
      await clearLoginLogs();
      setLogs([]);
    } catch { /* silent */ }
  };

  /* ─── HANDLERS: NOTIFICACIONES (frontend-only) ─── */
  const handleEnviarNotif = (dest: string) => {
    setNotifExito(null);
    if (!notifAsunto.trim() || !notifMensaje.trim()) return;
    setHistorialNotif([{ id: Date.now(), asunto: notifAsunto, mensaje: notifMensaje, destinatarios: dest, fecha: new Date().toLocaleString("es-CO") }, ...historialNotif]);
    setNotifExito(`Notificación enviada a: ${dest}`);
    setNotifAsunto(""); setNotifMensaje("");
    setTimeout(() => setNotifExito(null), 4000);
  };

  const getEstadoBadge = (estado: string) => ({
    activo: <Badge className="bg-emerald-500 hover:bg-emerald-500 text-white">Activo</Badge>,
    usado: <Badge className="bg-blue-700 hover:bg-blue-700 text-white">Usado</Badge>,
    expirado: <Badge variant="secondary">Expirado</Badge>
  }[estado] ?? null);

  const getEstadoIcon = (estado: string) => ({
    activo: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
    usado: <CheckCircle2 className="h-4 w-4 text-blue-700" />,
    expirado: <XCircle className="h-4 w-4 text-gray-400" />
  }[estado] ?? null);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div data-tour="config-header" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="font-bold text-2xl flex items-center gap-2"><Shield className="h-6 w-6 text-violet-600" />Configuración de Administrador</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control total de la plataforma</p>
              </div>
            </div>
            <Button data-tour="config-home" variant="ghost" size="icon" onClick={() => router.push("/admin")} className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800" title="Volver al inicio"><Home className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList data-tour="config-tabs" className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="perfil" className="gap-2"><User className="h-4 w-4" />Perfil</TabsTrigger>
            <TabsTrigger value="accesos" className="gap-2"><Key className="h-4 w-4" />Accesos</TabsTrigger>
            <TabsTrigger value="seguridad" className="gap-2"><Shield className="h-4 w-4" />Seguridad</TabsTrigger>
            <TabsTrigger value="notificaciones" className="gap-2"><Bell className="h-4 w-4" />Notif.</TabsTrigger>
          </TabsList>

          {/* ═══ PERFIL ═══ */}
          <TabsContent value="perfil">
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle>Perfil del Administrador</CardTitle><CardDescription>Información personal y de la cuenta</CardDescription></CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20"><AvatarFallback className="text-2xl bg-violet-100 text-violet-600">AD</AvatarFallback></Avatar>
                  <div><Button variant="outline" size="sm"><Camera className="mr-2 h-4 w-4" />Cambiar foto</Button><p className="text-xs text-gray-500 mt-1">JPG, PNG. Máx 5MB</p></div>
                </div>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="mt-2" /></div>
                  <div><Label htmlFor="email">Correo electrónico</Label><Input id="email" value={email} disabled className="mt-2 bg-slate-100" /></div>
                  <div><Label htmlFor="rol">Rol</Label><Input id="rol" value={rol} disabled className="mt-2 bg-slate-100" /></div>
                </div>
                <div className="flex justify-end"><Button className="bg-violet-600 hover:bg-violet-700 text-white"><Save className="mr-2 h-4 w-4" />Guardar Cambios</Button></div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ ACCESOS (BACKEND-CONNECTED) ═══ */}
          <TabsContent value="accesos" className="space-y-6">
            {/* Generate Code */}
            <Card data-tour="config-codes" className="border-2 border-dashed border-violet-200 dark:border-violet-800 bg-violet-50/50 dark:bg-violet-900/10">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Generar Nuevo Código</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Los códigos expiran automáticamente en 8 días si no se utilizan</p>
                    <Button onClick={handleGenerarCodigo} disabled={generando} className="mt-3 bg-violet-600 hover:bg-violet-700 text-white">
                      {generando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generando...</> : <><Key className="mr-2 h-4 w-4" />Generar Código</>}
                    </Button>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <span className="font-semibold text-violet-600">{codigos.filter(c => c.estado === "activo").length}</span> activos / {codigos.length} total
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Log */}
            <Card data-tour="config-codes-log" className="border-0 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-violet-600" />Log de Códigos Generados</CardTitle><CardDescription>Historial con estado y docente asociado — se eliminan 8 días después de expirar</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {codigosLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Cargando códigos...</div>
                ) : codigos.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No hay códigos generados aún.</p>
                ) : (
                  codigos.map(c => (
                    <div key={c.code} className={`p-4 rounded-lg border transition-colors ${c.estado === "activo" ? "border-emerald-200 dark:border-emerald-800 bg-white dark:bg-slate-900" : c.estado === "usado" ? "border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900" : "border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900/50"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getEstadoIcon(c.estado)}
                          <span className="font-mono font-semibold">{c.code}</span>
                          {getEstadoBadge(c.estado)}
                          {c.estado === "activo" && diasRestantes(c.expires_at) <= 2 && (
                            <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 animate-pulse"><AlertTriangle className="h-3 w-3 mr-1" />Expira pronto</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleCopiarCodigo(c.code)} title="Copiar">
                            {codigoCopiado === c.code ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                          </Button>
                          {c.estado === "activo" && (
                            <Button variant="ghost" size="icon" onClick={() => handleRevocarCodigo(c.code)} className="text-red-500 hover:text-red-700 hover:bg-red-50" title="Revocar"><Trash2 className="h-4 w-4" /></Button>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Creado: {c.created_at ? formatDate(c.created_at) : "—"}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Expira: {c.expires_at ? formatDate(c.expires_at) : "—"}{c.estado === "activo" && ` (${diasRestantes(c.expires_at)} días)`}</span>
                      </div>
                      {c.used_by_name && <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1"><Users className="h-3 w-3" />Usado por: {c.used_by_name}</p>}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Teacher Registration */}
            <Card data-tour="config-register" className="border-0 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><UserPlus className="h-5 w-5 text-violet-600" />Registrar Docente</CardTitle><CardDescription>Registra un nuevo docente manualmente o utilizando un código de invitación</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={modoRegistro === "manual" ? "default" : "outline"} onClick={() => setModoRegistro("manual")} className={modoRegistro === "manual" ? "bg-violet-600 hover:bg-violet-700" : ""}><UserPlus className="mr-2 h-4 w-4" />Registro Manual</Button>
                  <Button variant={modoRegistro === "codigo" ? "default" : "outline"} onClick={() => setModoRegistro("codigo")} className={modoRegistro === "codigo" ? "bg-violet-600 hover:bg-violet-700" : ""}><Key className="mr-2 h-4 w-4" />Con Código</Button>
                </div>
                {regError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">{regError}</div>}
                {regExito && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-600">{regExito}</div>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Nombre completo</Label><Input value={regNombre} onChange={e => setRegNombre(e.target.value)} placeholder="Nombre del docente" className="mt-1" /></div>
                  <div><Label>Correo electrónico</Label><Input type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="docente@iudc.com" className="mt-1" /></div>
                  {modoRegistro === "manual" && <div><Label>Contraseña temporal</Label><Input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="••••••••" className="mt-1" /></div>}
                  {modoRegistro === "codigo" && <div><Label>Código de invitación</Label><Input value={regCodigo} onChange={e => setRegCodigo(e.target.value)} placeholder="DOC-XXXXXX" className="mt-1 font-mono" /></div>}
                </div>
                <Button onClick={handleRegistrarDocente} disabled={registrando} className="w-full bg-violet-600 hover:bg-violet-700 text-white">
                  {registrando ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Registrando...</> : <><UserPlus className="mr-2 h-4 w-4" />Registrar Docente</>}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ SEGURIDAD (BACKEND-CONNECTED) ═══ */}
          <TabsContent value="seguridad" className="space-y-6">
            {/* System Limits */}
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-violet-600" />Límites del Sistema</CardTitle><CardDescription>Configura los límites operativos de la plataforma</CardDescription></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><Label>Máx. estudiantes por docente</Label><Input type="number" value={maxEstudiantesPorDocente} onChange={e => setMaxEstudiantesPorDocente(e.target.value)} className="mt-2" /><p className="text-xs text-gray-500 mt-1">Límite de estudiantes asignados</p></div>
                  <div><Label>Máx. materias por docente</Label><Input type="number" value={maxMateriasPorDocente} onChange={e => setMaxMateriasPorDocente(e.target.value)} className="mt-2" /><p className="text-xs text-gray-500 mt-1">Materias que puede gestionar</p></div>
                </div>
                <div className="flex items-center gap-2 mt-4 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <p className="text-xs text-amber-700 dark:text-amber-400">Modificar estos valores puede afectar el rendimiento del sistema.</p>
                </div>
              </CardContent>
            </Card>

            {/* Login Logs — from backend */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-violet-600" />Logs de Actividad</CardTitle><CardDescription>Registro real de inicios de sesión en la plataforma</CardDescription></div>
                  <div className="flex gap-2">
                    {(["todos", "acceso", "alerta"] as const).map(f => (
                      <Button key={f} variant={filtroLog === f ? "default" : "outline"} size="sm"
                        className={filtroLog === f ? "bg-violet-600 hover:bg-violet-700 text-white" : ""}
                        onClick={() => setFiltroLog(f)}>{f === "todos" ? "Todos" : f === "acceso" ? "Exitosos" : "Fallidos"}</Button>
                    ))}
                    <Button variant="outline" size="sm" onClick={handleLimpiarLogs} className="text-red-500 border-red-200 hover:bg-red-50"><Trash2 className="h-3 w-3 mr-1" />Limpiar</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {logsLoading ? (
                  <div className="flex items-center justify-center py-8 gap-2 text-gray-400"><Loader2 className="h-5 w-5 animate-spin" />Cargando logs...</div>
                ) : logsFiltrados.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No hay registros de actividad.</p>
                ) : (
                  logsFiltrados.map(log => (
                    <div key={log.id} className={`p-4 rounded-lg border transition-colors ${!log.success ? "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10" : "border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900"}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {log.success ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                          <span className="font-medium">{log.user_email}</span>
                          {!log.success && <Badge variant="destructive" className="text-xs">Fallido</Badge>}
                        </div>
                        <span className="text-xs text-gray-500 flex items-center gap-1"><Clock className="h-3 w-3" />{formatDate(log.created_at)}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{log.action}</p>
                      <div className="mt-1 flex gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />{log.ip}</span>
                        <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />{parseUserAgent(log.user_agent)}</span>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ═══ NOTIFICACIONES (frontend-only, unchanged) ═══ */}
          <TabsContent value="notificaciones" className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-orange-500" />Notificaciones Globales</CardTitle><CardDescription>Configura y envía notificaciones del sistema</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div><p className="font-medium">Notificaciones Masivas</p><p className="text-sm text-gray-500">Permite enviar notificaciones a todos los usuarios</p></div>
                  <Switch checked={notifMasivas} onCheckedChange={setNotifMasivas} />
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                  <div><p className="font-medium">Alertas del Sistema</p><p className="text-sm text-gray-500">Notificaciones sobre problemas técnicos</p></div>
                  <Switch checked={alertasSistema} onCheckedChange={setAlertasSistema} />
                </div>
                <Separator />
                <div className={`${!notifMasivas ? "opacity-50 pointer-events-none" : ""}`}>
                  {!notifMasivas && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700 mb-4"><AlertTriangle className="inline h-4 w-4 mr-1" />Las notificaciones masivas están desactivadas.</div>}
                  <h4 className="font-semibold mb-3">Enviar Notificación Masiva</h4>
                  <Input placeholder="Asunto de la notificación" value={notifAsunto} onChange={e => setNotifAsunto(e.target.value)} className="mb-3" />
                  <textarea placeholder="Mensaje de la notificación..." value={notifMensaje} onChange={e => setNotifMensaje(e.target.value)} className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent resize-none min-h-[100px]" />
                  {notifExito && <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-600 mt-3">{notifExito}</div>}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <Button onClick={() => handleEnviarNotif("Estudiantes")} disabled={!notifAsunto.trim() || !notifMensaje.trim()} className="bg-emerald-500 hover:bg-emerald-600 text-white"><Mail className="mr-2 h-4 w-4" />Enviar a Estudiantes</Button>
                    <Button onClick={() => handleEnviarNotif("Docentes")} disabled={!notifAsunto.trim() || !notifMensaje.trim()} className="bg-violet-500 hover:bg-violet-600 text-white"><Mail className="mr-2 h-4 w-4" />Enviar a Docentes</Button>
                    <Button onClick={() => handleEnviarNotif("Todos")} disabled={!notifAsunto.trim() || !notifMensaje.trim()} className="bg-gradient-to-r from-violet-500 to-emerald-500 hover:from-violet-600 hover:to-emerald-600 text-white"><Send className="mr-2 h-4 w-4" />Enviar a Todos</Button>
                  </div>
                </div>

                {historialNotif.length > 0 && (
                  <div className="mt-6">
                    <Separator className="mb-4" />
                    <h4 className="font-semibold mb-3">Historial de Notificaciones</h4>
                    <div className="space-y-3">
                      {historialNotif.map(n => (
                        <div key={n.id} className="p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-900">
                          <div className="flex justify-between items-start"><p className="font-medium text-sm">{n.asunto}</p><span className="text-xs text-gray-500">{n.fecha}</span></div>
                          <p className="text-xs text-gray-500 mt-1">{n.mensaje}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">{n.destinatarios}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4"><Button className="bg-violet-600 hover:bg-violet-700 text-white"><Save className="mr-2 h-4 w-4" />Guardar Preferencias</Button></div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function ConfiguracionAdminPage() {
  return <ProtectedRoute requiredRole="admin"><ConfiguracionAdmin /></ProtectedRoute>;
}
