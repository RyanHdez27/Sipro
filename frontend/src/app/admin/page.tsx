"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserNav } from "@/components/UserNav";
import { getAdminStats } from "@/lib/api";
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  Users, GraduationCap, TrendingUp, Shield, Award, BarChart3,
  Eye, UserCheck, Activity, AlertCircle, BookOpen, Mail, CheckCircle2
} from "lucide-react";

/* ─── TYPES ─── */
interface BackendUser {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  carrera?: string | null;
}

/* ─── SIMULATED STUDENT PERFORMANCE DATA (6 áreas Saber Pro) ─── */
const AREAS_SABER_PRO = [
  "Matemáticas", "Lectura Crítica", "Ciencias Naturales",
  "Razonamiento Cuantitativo", "Inglés", "Ciencias Sociales"
];

function generarEstudiantesSimulados(nombresReales: { id: number; name: string; email: string }[]) {
  const seed = (i: number, j: number) => ((i * 7 + j * 13 + 42) % 100);
  return nombresReales.map((est, i) => {
    const scores: Record<string, number> = {};
    AREAS_SABER_PRO.forEach((area, j) => {
      scores[area] = Math.max(25, Math.min(100, seed(i, j) + Math.floor((i * 3 + j * 5) % 30)));
    });
    const promedio = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / 6);
    return { ...est, scores, promedio };
  });
}

const crecimientoBase = [
  { mes: "Sep", estudiantes: 12, docentes: 2 },
  { mes: "Oct", estudiantes: 28, docentes: 3 },
  { mes: "Nov", estudiantes: 45, docentes: 4 },
  { mes: "Dic", estudiantes: 62, docentes: 5 },
  { mes: "Ene", estudiantes: 80, docentes: 6 },
  { mes: "Feb", estudiantes: 95, docentes: 7 },
];

const COLORS_PIE = ["#10B981", "#F97316", "#7C3AED"];
const COLORS_BAR = ["#1D4ED8", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

export default function AdminPage() {
  const [vistaActual, setVistaActual] = useState<"general" | "materias" | "docentes" | "estudiantes">("general");
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalDocentes, setTotalDocentes] = useState(0);
  const [docentesLista, setDocentesLista] = useState<BackendUser[]>([]);
  const [estudiantesBackend, setEstudiantesBackend] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);

  /* Fetch real data */
  useEffect(() => {
    getAdminStats()
      .then((data) => {
        setTotalEstudiantes(data.total_estudiantes);
        setTotalDocentes(data.total_docentes);
        setDocentesLista(data.docentes);
        setEstudiantesBackend(data.estudiantes);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Simulated student data based on real names */
  const estudiantesConNotas = useMemo(
    () => generarEstudiantesSimulados(estudiantesBackend),
    [estudiantesBackend]
  );

  /* Derived stats */
  const promedioGeneral = useMemo(() => {
    if (estudiantesConNotas.length === 0) return 0;
    return Math.round(estudiantesConNotas.reduce((s, e) => s + e.promedio, 0) / estudiantesConNotas.length);
  }, [estudiantesConNotas]);

  const tasaAprobacion = useMemo(() => {
    if (estudiantesConNotas.length === 0) return 0;
    const aprobados = estudiantesConNotas.filter(e => e.promedio >= 60).length;
    return Math.round((aprobados / estudiantesConNotas.length) * 100);
  }, [estudiantesConNotas]);

  const top5 = useMemo(
    () => [...estudiantesConNotas].sort((a, b) => b.promedio - a.promedio).slice(0, 5),
    [estudiantesConNotas]
  );

  const clasificacion = useMemo(() => {
    const riesgo = estudiantesConNotas.filter(e => e.promedio < 60).length;
    const regulares = estudiantesConNotas.filter(e => e.promedio >= 60 && e.promedio < 80).length;
    const sobresalientes = estudiantesConNotas.filter(e => e.promedio >= 80).length;
    return { riesgo, regulares, sobresalientes };
  }, [estudiantesConNotas]);

  /* Chart data */
  const plataformaData = useMemo(() => {
    const estudiantesActivos = estudiantesBackend.filter(e => e.is_active).length;
    const docentesActivos = docentesLista.filter(d => d.is_active).length;
    return [
      { name: "Estudiantes Activos", Cantidad: estudiantesActivos },
      { name: "Docentes Activos", Cantidad: docentesActivos }
    ];
  }, [estudiantesBackend, docentesLista]);

  const distribucionCarreraData = useMemo(() => {
    if (estudiantesBackend.length === 0) return [];
    
    // Contar por carrera real
    const conteo: Record<string, number> = {};
    estudiantesBackend.forEach(e => {
        const c = e.carrera || "Sin asignar";
        conteo[c] = (conteo[c] || 0) + 1;
    });
    
    return Object.entries(conteo).map(([nombre, value]) => ({ nombre, value }));
  }, [estudiantesBackend]);

  const rendimientoPorArea = useMemo(() => {
    if (estudiantesConNotas.length === 0) return AREAS_SABER_PRO.map(a => ({ area: a, promedio: 0, estudiantes: 0 }));
    return AREAS_SABER_PRO.map(area => {
      const promedioArea = Math.round(
        estudiantesConNotas.reduce((s, e) => s + (e.scores[area] || 0), 0) / estudiantesConNotas.length
      );
      return { area, promedio: promedioArea, estudiantes: estudiantesConNotas.length };
    });
  }, [estudiantesConNotas]);

  const materiasTabla = useMemo(() => {
    return AREAS_SABER_PRO.map(area => {
      const promedios = estudiantesConNotas.map(e => e.scores[area] || 0);
      const promedio = promedios.length > 0 ? Math.round(promedios.reduce((a,b) => a+b, 0) / promedios.length) : 0;
      const aprobados = promedios.filter(p => p >= 60).length;
      const tasa = promedios.length > 0 ? Math.round((aprobados / promedios.length) * 100) : 0;
      return { area, promedio, totalEstudiantes: promedios.length, aprobados, tasaAprobacion: tasa };
    });
  }, [estudiantesConNotas]);

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Cargando dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="admin">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header data-tour="admin-header" className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-600"><Shield className="w-8 h-8 text-white" /></div>
              <div>
                <h1 className="font-bold text-xl">Panel de Administración</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control total de la plataforma</p>
              </div>
            </div>
            <UserNav />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Nav */}
        <div data-tour="admin-nav" className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {([["general", BarChart3, "Vista General"], ["materias", BookOpen, "Materias"], ["docentes", GraduationCap, "Docentes"], ["estudiantes", Users, "Estudiantes"]] as const).map(([id, Icon, label]) => (
            <Button key={id} onClick={() => setVistaActual(id)} variant={vistaActual === id ? "default" : "outline"}
              className={vistaActual === id ? "bg-violet-600 hover:bg-violet-700 text-white" : "dark:border-gray-700"}>
              <Icon className="w-4 h-4 mr-2" />{label}
            </Button>
          ))}
        </div>

        {/* ═══ VISTA GENERAL ═══ */}
        {vistaActual === "general" && (
          <>
            <div data-tour="admin-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Estudiantes</CardTitle>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20"><Users className="w-5 h-5 text-blue-600 dark:text-blue-400" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalEstudiantes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Registrados en la plataforma</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Docentes</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><GraduationCap className="w-5 h-5 text-emerald-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalDocentes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Activos en la plataforma</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio General</CardTitle>
                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20"><Award className="w-5 h-5 text-violet-600" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{promedioGeneral}<span className="text-lg text-gray-400">/100</span></div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio de todas las áreas</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa de Aprobación</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{tasaAprobacion}%</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Estudiantes con promedio ≥ 60</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div data-tour="admin-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader><CardTitle className="text-lg">Estado de la Plataforma</CardTitle><CardDescription>Usuarios activos e inactivos por rol</CardDescription></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={plataformaData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" opacity={0.3} />
                      <XAxis type="number" stroke="#6B7280" />
                      <YAxis dataKey="name" type="category" stroke="#6B7280" width={120} />
                      <Tooltip contentStyle={{ backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: "8px", color: "#000" }} />
                      <Bar dataKey="Cantidad" fill="#10B981" radius={[0, 4, 4, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader><CardTitle className="text-lg">Distribución por Carrera</CardTitle><CardDescription>Estudiantes por programa académico</CardDescription></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={distribucionCarreraData} cx="50%" cy="50%" labelLine={false}
                        label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={100} fill="#8884d8" dataKey="value" nameKey="nombre">
                        {distribucionCarreraData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: "8px", color: "#000" }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader><CardTitle className="text-lg">Rendimiento por Área (Saber Pro)</CardTitle><CardDescription>Promedio de estudiantes en cada competencia evaluada</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rendimientoPorArea}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="area" stroke="#6B7280" angle={-20} textAnchor="end" height={80} />
                    <YAxis stroke="#6B7280" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: "8px", color: "#000" }} />
                    <Bar dataKey="promedio" radius={[8, 8, 0, 0]}>
                      {rendimientoPorArea.map((_, i) => <Cell key={i} fill={COLORS_BAR[i % COLORS_BAR.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* ═══ MATERIAS ═══ */}
        {vistaActual === "materias" && (
          <>
            <Card className="border-0 shadow-sm mb-6 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg">Resumen Ponderado por Área</CardTitle>
                <CardDescription>Las 6 competencias evaluadas en la prueba Saber Pro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Área / Competencia</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Estudiantes</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Promedio</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Aprobados</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Tasa Aprobación</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materiasTabla.map((m, i) => (
                        <tr key={m.area} className="border-b border-gray-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS_BAR[i] }} />
                              <span className="font-medium">{m.area}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              <Users className="w-3 h-3" />{m.totalEstudiantes}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-semibold ${m.promedio >= 80 ? "text-emerald-600" : m.promedio >= 60 ? "text-blue-600" : "text-orange-600"}`}>
                              {m.promedio}/100
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-sm">{m.aprobados}/{m.totalEstudiantes}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Progress value={m.tasaAprobacion} className="w-20 h-2" />
                              <span className="text-sm font-medium">{m.tasaAprobacion}%</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader><CardTitle className="text-lg">Estudiantes por Área</CardTitle><CardDescription>Distribución y promedio por competencia</CardDescription></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={rendimientoPorArea}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="area" stroke="#6B7280" angle={-20} textAnchor="end" height={80} />
                    <YAxis stroke="#6B7280" />
                    <Tooltip contentStyle={{ backgroundColor: "#FFF", borderColor: "#E5E7EB", borderRadius: "8px", color: "#000" }} />
                    <Legend />
                    <Bar dataKey="estudiantes" name="Estudiantes" fill="#1D4ED8" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="promedio" name="Promedio" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* ═══ DOCENTES ═══ */}
        {vistaActual === "docentes" && (
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Docentes Inscritos</CardTitle>
                  <CardDescription>Total: {docentesLista.length} docentes registrados en la plataforma</CardDescription>
                </div>
                <GraduationCap className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              {docentesLista.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-1">Sin docentes registrados</p>
                  <p className="text-sm">Los docentes aparecerán aquí cuando se registren en la plataforma.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">#</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Docente</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Email</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {docentesLista.map((d, i) => (
                        <tr key={d.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="py-4 px-4 text-sm text-gray-400">{i + 1}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-violet-600 text-sm">
                                {d.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                              </div>
                              <span className="font-medium">{d.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3" />{d.email}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${d.is_active ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                              <CheckCircle2 className="w-3 h-3" />{d.is_active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* ═══ ESTUDIANTES ═══ */}
        {vistaActual === "estudiantes" && (
          <>
            <Card className="border-0 shadow-sm mb-6 dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div><CardTitle className="text-lg">Top 5 Estudiantes</CardTitle><CardDescription>Mejor rendimiento promedio en Saber Pro</CardDescription></div>
                  <Award className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                {top5.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">No hay estudiantes registrados.</p>
                ) : (
                  <div className="space-y-4">
                    {top5.map((est, index) => (
                      <div key={est.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-sm"
                          style={{ backgroundColor: index === 0 ? "#F59E0B" : index === 1 ? "#9CA3AF" : index === 2 ? "#D97706" : "#7C3AED" }}>
                          {index + 1}
                        </div>
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-blue-600">
                          {est.name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{est.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{est.email}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{est.promedio}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Promedio</div>
                        </div>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">En Riesgo</CardTitle>
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500">{clasificacion.riesgo}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio &lt; 60</p>
                  <div className="mt-3"><Progress value={totalEstudiantes > 0 ? (clasificacion.riesgo / totalEstudiantes) * 100 : 0} className="h-2" /></div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Regulares</CardTitle>
                    <Activity className="w-5 h-5 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{clasificacion.regulares}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio 60-80</p>
                  <div className="mt-3"><Progress value={totalEstudiantes > 0 ? (clasificacion.regulares / totalEstudiantes) * 100 : 0} className="h-2" /></div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Sobresalientes</CardTitle>
                    <UserCheck className="w-5 h-5 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-500">{clasificacion.sobresalientes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio &gt; 80</p>
                  <div className="mt-3"><Progress value={totalEstudiantes > 0 ? (clasificacion.sobresalientes / totalEstudiantes) * 100 : 0} className="h-2" /></div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}