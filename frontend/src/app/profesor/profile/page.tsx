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
  User, Mail, Lock, BookOpen, Settings, Bell, Shield, Save, Camera,
  X, Plus, Home, GraduationCap, Users, Globe
} from "lucide-react";

function ConfiguracionDocente() {
  const router = useRouter();

  const [nombre, setNombre] = useState("Julio Profe");
  const [email, setEmail] = useState("julioprofe@iudc.com");
  const [materias, setMaterias] = useState(["Matemáticas Avanzadas", "Cálculo Diferencial", "Álgebra Lineal"]);
  const [nuevaMateria, setNuevaMateria] = useState("");
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirmar, setPasswordConfirmar] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [notifEntregas, setNotifEntregas] = useState(true);
  const [notifMensajes, setNotifMensajes] = useState(true);
  const [notifRecordatorios, setNotifRecordatorios] = useState(false);
  const [idioma, setIdioma] = useState("es");
  const [escalaCalificacion, setEscalaCalificacion] = useState("0-5");
  const [promediosAutomaticos, setPromediosAutomaticos] = useState(true);

  const handleAgregarMateria = () => {
    if (nuevaMateria.trim()) { setMaterias([...materias, nuevaMateria.trim()]); setNuevaMateria(""); }
  };
  const handleEliminarMateria = (i: number) => setMaterias(materias.filter((_, idx) => idx !== i));

  const handleCambiarPassword = () => {
    if (passwordNueva !== passwordConfirmar) return;
    if (passwordNueva.length < 6) return;
    setPasswordActual(""); setPasswordNueva(""); setPasswordConfirmar("");
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
                <p className="text-sm text-gray-500 dark:text-gray-400">Administra tu cuenta y preferencias</p>
              </div>
            </div>
            <Button data-tour="config-home" variant="ghost" size="icon" onClick={() => router.push("/profesor")} className="w-10 h-10 hover:bg-slate-100 dark:hover:bg-slate-800" title="Volver al inicio"><Home className="h-6 w-6" /></Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="perfil" className="space-y-6">
          <TabsList data-tour="config-tabs" className="grid w-full grid-cols-3 lg:w-[600px] dark:bg-slate-800">
            <TabsTrigger value="perfil"><User className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Perfil</span></TabsTrigger>
            <TabsTrigger value="cuenta"><Settings className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Cuenta</span></TabsTrigger>
            <TabsTrigger value="academicas"><BookOpen className="h-4 w-4 mr-1" /><span className="hidden sm:inline">Académicas</span></TabsTrigger>
          </TabsList>

          {/* ─── PERFIL ─── */}
          <TabsContent data-tour="config-content" value="perfil">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-blue-700" />Perfil del Docente</CardTitle>
                <CardDescription>Gestiona tu información personal y profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-700 text-white text-2xl">JP</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" className="flex items-center gap-2 dark:border-gray-700"><Camera className="h-4 w-4" />Cambiar Foto</Button>
                    <p className="text-xs text-gray-500">JPG, PNG o GIF. Máx 2MB.</p>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input value={nombre} onChange={e => setNombre(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={e => setEmail(e.target.value)} className="dark:bg-slate-800 dark:border-gray-700" />
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base">Materias que Imparte</Label>
                    <Badge variant="secondary"><BookOpen className="h-3 w-3 mr-1" />{materias.length} materias</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {materias.map((m, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1.5 flex items-center gap-2 dark:border-gray-700">
                        {m}
                        <button onClick={() => handleEliminarMateria(i)} className="hover:text-orange-500"><X className="h-3 w-3" /></button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Agregar nueva materia..." value={nuevaMateria} onChange={e => setNuevaMateria(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAgregarMateria()} className="dark:bg-slate-800 dark:border-gray-700" />
                    <Button onClick={handleAgregarMateria} className="bg-emerald-500 hover:bg-emerald-600"><Plus className="h-4 w-4" /></Button>
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-blue-700 rounded-lg"><Users className="h-5 w-5 text-white" /></div>
                    <div><p className="text-sm text-gray-500">Total Estudiantes</p><p className="text-2xl font-bold">156</p></div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="p-2 bg-emerald-500 rounded-lg"><GraduationCap className="h-5 w-5 text-white" /></div>
                    <div><p className="text-sm text-gray-500">Trabajos Creados</p><p className="text-2xl font-bold">42</p></div>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <Button className="bg-blue-700 hover:bg-blue-800 flex items-center gap-2"><Save className="h-4 w-4" />Guardar Cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ─── CUENTA ─── */}
          <TabsContent value="cuenta" className="space-y-6">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5 text-blue-700" />Cambiar Contraseña</CardTitle>
                <CardDescription>Mantén tu cuenta segura con una contraseña fuerte</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Contraseña Actual</Label><Input type="password" value={passwordActual} onChange={e => setPasswordActual(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="space-y-2"><Label>Nueva Contraseña</Label><Input type="password" value={passwordNueva} onChange={e => setPasswordNueva(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="space-y-2"><Label>Confirmar Nueva Contraseña</Label><Input type="password" value={passwordConfirmar} onChange={e => setPasswordConfirmar(e.target.value)} placeholder="••••••••" className="dark:bg-slate-800 dark:border-gray-700" /></div>
                <div className="flex justify-end pt-2"><Button onClick={handleCambiarPassword} className="bg-blue-700 hover:bg-blue-800">Actualizar Contraseña</Button></div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5 text-violet-600" />Autenticación en Dos Factores (2FA)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div><div className="text-sm font-medium">Activar 2FA</div><div className="text-sm text-gray-500">Requiere código de verificación al iniciar sesión</div></div>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
                {twoFactorEnabled && <div className="mt-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-lg border border-violet-200 dark:border-violet-800"><p className="text-sm text-violet-600 dark:text-violet-400 font-medium">✓ 2FA activado</p></div>}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5 text-orange-500" />Preferencias de Notificaciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Nuevas Entregas</div><div className="text-sm text-gray-500">Cuando un estudiante entregue un trabajo</div></div><Switch checked={notifEntregas} onCheckedChange={setNotifEntregas} /></div>
                <Separator className="dark:border-gray-800" />
                <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Mensajes de Estudiantes</div><div className="text-sm text-gray-500">Nuevos mensajes recibidos</div></div><Switch checked={notifMensajes} onCheckedChange={setNotifMensajes} /></div>
                <Separator className="dark:border-gray-800" />
                <div className="flex items-center justify-between"><div><div className="text-sm font-medium">Recordatorios de Trabajos</div><div className="text-sm text-gray-500">Antes de la fecha límite</div></div><Switch checked={notifRecordatorios} onCheckedChange={setNotifRecordatorios} /></div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-700" />Idioma de la Plataforma</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={idioma} onValueChange={setIdioma}>
                  <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="es">Español</SelectItem><SelectItem value="en">English</SelectItem><SelectItem value="pt">Português</SelectItem></SelectContent>
                </Select>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="bg-emerald-500 hover:bg-emerald-600 flex items-center gap-2"><Save className="h-4 w-4" />Guardar Configuración</Button>
            </div>
          </TabsContent>

          {/* ─── ACADÉMICAS ─── */}
          <TabsContent value="academicas">
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-blue-700" />Preferencias Académicas</CardTitle>
                <CardDescription>Configura las opciones para la gestión de trabajos y calificaciones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base">Tipos de Trabajos por Defecto</Label>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[["Quiz","Evaluaciones cortas",true],["Taller","Trabajos prácticos",true],["Examen","Evaluaciones finales",true],["Proyecto","Trabajos extensos",false]].map(([tipo, desc, checked], i) => (
                      <div key={i} className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-blue-700 dark:hover:border-blue-500 cursor-pointer transition-colors">
                        <div className="flex items-center gap-2"><input type="checkbox" defaultChecked={!!checked} className="rounded" /><span className="font-medium">{tipo}</span></div>
                        <p className="text-sm text-gray-500 mt-1">{desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-2">
                  <Label>Escala de Calificación</Label>
                  <Select value={escalaCalificacion} onValueChange={setEscalaCalificacion}>
                    <SelectTrigger className="dark:bg-slate-800 dark:border-gray-700"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-5">0.0 - 5.0 (Colombia)</SelectItem>
                      <SelectItem value="0-10">0 - 10</SelectItem>
                      <SelectItem value="0-100">0 - 100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div><div className="text-sm font-medium">Calcular Promedios Automáticamente</div><div className="text-sm text-gray-500">El sistema calculará los promedios de los estudiantes</div></div>
                  <Switch checked={promediosAutomaticos} onCheckedChange={setPromediosAutomaticos} />
                </div>
                <Separator className="dark:border-gray-800" />
                <div className="space-y-4">
                  <Label className="text-base">Plazos por Defecto (días)</Label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[["Quiz",7],["Taller",14],["Examen",3],["Proyecto",30]].map(([tipo, dias], i) => (
                      <div key={i} className="space-y-2">
                        <Label>Plazo {tipo}</Label>
                        <Input type="number" defaultValue={dias} min="1" className="dark:bg-slate-800 dark:border-gray-700" />
                      </div>
                    ))}
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

export default function ProfesorProfilePage() {
  return (
    <ProtectedRoute requiredRole="profesor">
      <ConfiguracionDocente />
    </ProtectedRoute>
  );
}
