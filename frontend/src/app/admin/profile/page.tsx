"use client";

import { useState } from "react";
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
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  User, Shield, Settings, Key, Database, Bell, Save, Camera, ArrowLeft,
  Copy, RefreshCw, Trash2, Clock, CheckCircle2, XCircle, AlertTriangle,
  Users, BookOpen, Calendar, Activity, Lock, Image
} from "lucide-react";

interface CodigoRegistro {
  codigo: string;
  fechaCreacion: string;
  fechaExpiracion: string;
  estado: "activo" | "usado" | "expirado";
  docenteAsociado?: string;
}

function ConfiguracionAdmin() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Admin Principal");
  const [email, setEmail] = useState("admin@siproudc.com");
  const [rol, setRol] = useState("Super Admin");
  const [codigos, setCodigos] = useState<CodigoRegistro[]>([
    { codigo: "DOC-8XK29Q", fechaCreacion: "2026-03-20", fechaExpiracion: "2026-04-20", estado: "usado", docenteAsociado: "Prof. Julio Profe" },
    { codigo: "DOC-7PL45M", fechaCreacion: "2026-03-22", fechaExpiracion: "2026-04-22", estado: "activo" }
  ]);
  const [nombrePlataforma, setNombrePlataforma] = useState("SIPRO UDC");
  const [maxEstudiantesPorDocente, setMaxEstudiantesPorDocente] = useState("200");
  const [maxMateriasPorDocente, setMaxMateriasPorDocente] = useState("10");
  const [notifMasivas, setNotifMasivas] = useState(true);
  const [alertasSistema, setAlertasSistema] = useState(true);

  const generarCodigoAleatorio = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let codigo = "DOC-";
    for (let i = 0; i < 6; i++) codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    return codigo;
  };

  const handleGenerarCodigo = () => {
    const nuevo: CodigoRegistro = {
      codigo: generarCodigoAleatorio(),
      fechaCreacion: new Date().toISOString().split("T")[0],
      fechaExpiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      estado: "activo"
    };
    setCodigos([nuevo, ...codigos]);
  };

  const handleCopiarCodigo = (codigo: string) => { navigator.clipboard.writeText(codigo); };
  const handleRevocarCodigo = (codigo: string) => {
    setCodigos(codigos.map(c => c.codigo === codigo ? { ...c, estado: "expirado" as const } : c));
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
      <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.push("/admin")} className="hover:bg-slate-100 dark:hover:bg-slate-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="font-bold text-2xl flex items-center gap-2">
                  <Shield className="h-6 w-6 text-violet-600" />
                  Configuración de Administrador
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control total de la plataforma</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push("/admin")} className="dark:border-gray-700">
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto dark:bg-slate-800">
            <TabsTrigger value="perfil"><User className="h-4 w-4 mr-1 hidden lg:inline-block" /><span>Perfil</span></TabsTrigger>
            <TabsTrigger value="accesos"><Key className="h-4 w-4 mr-1 hidden lg:inline-block" /><span>Accesos</span></TabsTrigger>
            <TabsTrigger value="plataforma"><Database className="h-4 w-4 mr-1 hidden lg:inline-block" /><span>Plataforma</span></TabsTrigger>
            <TabsTrigger value="seguridad"><Shield className="h-4 w-4 mr-1 hidden lg:inline-block" /><span>Seguridad</span></TabsTrigger>
            <TabsTrigger value="notificaciones"><Bell className="h-4 w-4 mr-1 hidden lg:inline-block" /><span>Notif.</span></TabsTrigger>
          </TabsList>

          {/* ─── PERFIL ─── */}
          <TabsContent value="perfil">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-violet-600" />Perfil del Administrador</CardTitle>
                <CardDescription>Información del administrador del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-violet-600 text-white text-2xl">AP</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700"><Camera className="h-4 w-4" />Cambiar Foto</Button>
                    <p className="text-xs text-gray-500">JPG, PNG o GIF. Máx 2MB.</p>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-admin">Nombre Completo</Label>
                    <Input id="nombre-admin" value={nombre} onChange={e => setNombre(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-admin">Email</Label>
                    <Input id="email-admin" type="email" value={email} onChange={e => setEmail(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                  </div>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <Select value={rol} onValueChange={setRol}>
                      <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Super Admin">Super Admin</SelectItem><SelectItem value="Admin">Admin</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Último Acceso</Label>
                    <div className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <Clock className="h-4 w-4 text-gray-500" /><span className="text-sm">25/03/2026 - 14:30</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="bg-violet-600 hover:bg-violet-700 flex items-center gap-2"><Save className="h-4 w-4" />Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── ACCESOS / CÓDIGOS ─── */}
          <TabsContent value="accesos" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Key className="h-5 w-5 text-violet-600" />Generador de Códigos para Docentes</CardTitle>
                <CardDescription>Crea códigos únicos de registro para nuevos docentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 p-6 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 rounded-lg border-2 border-dashed border-violet-300 dark:border-violet-700">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">Generar Nuevo Código</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Los códigos tienen una validez de 30 días desde su creación</p>
                    <Button onClick={handleGenerarCodigo} className="bg-violet-600 hover:bg-violet-700 flex items-center gap-2"><RefreshCw className="h-4 w-4" />Generar Código</Button>
                  </div>
                  <div className="flex items-center justify-center p-4">
                    <div className="text-center">
                      <Key className="h-16 w-16 text-violet-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">{codigos.length} códigos generados</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-blue-700" />Códigos de Registro Generados</CardTitle>
                <CardDescription>Gestiona y monitorea todos los códigos de acceso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {codigos.map((c, i) => (
                    <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-violet-300 dark:hover:border-violet-700 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            {getEstadoIcon(c.estado)}
                            <code className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded font-mono text-lg font-bold">{c.codigo}</code>
                            {getEstadoBadge(c.estado)}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm text-gray-500">
                            <div className="flex items-center gap-2"><Calendar className="h-3 w-3" />Creado: {c.fechaCreacion}</div>
                            <div className="flex items-center gap-2"><Clock className="h-3 w-3" />Expira: {c.fechaExpiracion}</div>
                          </div>
                          {c.docenteAsociado && (
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-3 w-3 text-blue-700" /><span className="font-medium text-blue-700 dark:text-blue-400">{c.docenteAsociado}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleCopiarCodigo(c.codigo)} disabled={c.estado === "expirado"} className="dark:border-gray-700"><Copy className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => handleRevocarCodigo(c.codigo)} disabled={c.estado !== "activo"} className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 dark:border-gray-700"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── PLATAFORMA ─── */}
          <TabsContent value="plataforma" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-blue-700" />Configuración General</CardTitle>
                <CardDescription>Personaliza la plataforma educativa</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre-plataforma">Nombre de la Plataforma</Label>
                  <Input id="nombre-plataforma" value={nombrePlataforma} onChange={e => setNombrePlataforma(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <Label className="text-base">Períodos Académicos</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2"><Label>Inicio del Período</Label><Input type="date" defaultValue="2026-02-01" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                    <div className="space-y-2"><Label>Fin del Período</Label><Input type="date" defaultValue="2026-06-30" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <Label className="text-base">Gestión de Carreras</Label>
                  <div className="space-y-2">
                    {["Ingeniería de Sistemas", "Administración de Empresas", "Derecho", "Medicina"].map((c, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                        <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-blue-700" /><span>{c}</span></div>
                        <Button size="sm" variant="ghost"><Trash2 className="h-4 w-4 text-orange-500" /></Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full dark:border-gray-700"><BookOpen className="h-4 w-4 mr-2" />Agregar Nueva Carrera</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-orange-500" />Límites del Sistema</CardTitle>
                <CardDescription>Define los límites operacionales de la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Máx. Estudiantes por Docente</Label>
                    <Input type="number" value={maxEstudiantesPorDocente} onChange={e => setMaxEstudiantesPorDocente(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                    <p className="text-xs text-gray-500">Recomendado: 150-200</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Máx. Materias por Docente</Label>
                    <Input type="number" value={maxMateriasPorDocente} onChange={e => setMaxMateriasPorDocente(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                    <p className="text-xs text-gray-500">Recomendado: 5-10</p>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <div className="flex gap-3"><AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" /><div className="text-sm"><p className="font-medium text-orange-500 mb-1">Advertencia</p><p className="text-gray-600 dark:text-gray-400">Cambiar estos límites puede afectar el rendimiento del sistema.</p></div></div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"><Save className="h-4 w-4" />Guardar Configuración</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── SEGURIDAD ─── */}
          <TabsContent value="seguridad" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5 text-violet-600" />Logs de Actividad</CardTitle>
                <CardDescription>Monitorea las acciones importantes del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { usuario: "admin@siproudc.com", accion: "Generó código de docente", fecha: "25/03/2026 14:25", alerta: false },
                    { usuario: "julioprofe@iudc.com", accion: "Creó nueva materia", fecha: "25/03/2026 13:45", alerta: false },
                    { usuario: "ryanhdez27@iudc.com", accion: "Intentó acceso no autorizado", fecha: "25/03/2026 12:30", alerta: true },
                    { usuario: "admin@siproudc.com", accion: "Modificó límites del sistema", fecha: "24/03/2026 16:20", alerta: false }
                  ].map((log, i) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-gray-800">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">{log.usuario}</span>
                            {log.alerta && <Badge variant="outline" className="text-orange-500 border-orange-500">Alerta</Badge>}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{log.accion}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500"><Clock className="h-3 w-3" />{log.fecha}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-orange-500" />Control de Sesiones</CardTitle>
                <CardDescription>Gestiona las sesiones activas en la plataforma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-blue-700">124</p><p className="text-sm text-gray-500">Estudiantes</p></div>
                    <div><p className="text-2xl font-bold text-emerald-500">8</p><p className="text-sm text-gray-500">Docentes</p></div>
                    <div><p className="text-2xl font-bold text-violet-600">1</p><p className="text-sm text-gray-500">Admins</p></div>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <Button variant="outline" className="w-full border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20">
                  <Lock className="h-4 w-4 mr-2" />Cerrar Todas las Sesiones
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── NOTIFICACIONES ─── */}
          <TabsContent value="notificaciones">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-orange-500" />Notificaciones Globales</CardTitle>
                <CardDescription>Configura las notificaciones del sistema</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div><div className="text-sm font-medium">Notificaciones Masivas</div><div className="text-sm text-gray-500">Permite enviar notificaciones a todos los usuarios</div></div>
                  <Switch checked={notifMasivas} onCheckedChange={setNotifMasivas} />
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div><div className="text-sm font-medium">Alertas del Sistema</div><div className="text-sm text-gray-500">Notificaciones sobre problemas técnicos</div></div>
                  <Switch checked={alertasSistema} onCheckedChange={setAlertasSistema} />
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <Label className="text-base">Enviar Notificación Masiva</Label>
                  <div className="space-y-2">
                    <Input placeholder="Asunto de la notificación" className="dark:bg-slate-800 dark:border-gray-700" />
                    <textarea className="w-full min-h-[100px] p-3 border border-gray-300 dark:border-gray-700 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white dark:bg-slate-800 text-sm" placeholder="Mensaje de la notificación..." />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button className="bg-blue-700 hover:bg-blue-800 flex-1"><Bell className="h-4 w-4 mr-2" />Enviar a Estudiantes</Button>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 flex-1"><Bell className="h-4 w-4 mr-2" />Enviar a Docentes</Button>
                    <Button className="bg-violet-600 hover:bg-violet-700 flex-1"><Bell className="h-4 w-4 mr-2" />Enviar a Todos</Button>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"><Save className="h-4 w-4" />Guardar Preferencias</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminProfilePage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <ConfiguracionAdmin />
    </ProtectedRoute>
  );
}
