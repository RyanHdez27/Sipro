"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserNav } from "@/components/UserNav";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Shield,
  Calendar,
  Award,
  BarChart3,
  Trash2,
  Eye,
  UserCheck,
  BookMarked,
  Activity,
  AlertCircle
} from "lucide-react";

// Datos de ejemplo
const estadisticasGenerales = {
  totalEstudiantes: 248,
  totalDocentes: 12,
  totalMaterias: 18,
  totalTrabajos: 86,
  promedioGeneral: 77,
  tasaAprobacion: 85
};

const crecimientoData = [
  { mes: 'Sep', estudiantes: 180, docentes: 10, materias: 14 },
  { mes: 'Oct', estudiantes: 205, docentes: 11, materias: 16 },
  { mes: 'Nov', estudiantes: 225, docentes: 11, materias: 17 },
  { mes: 'Dic', estudiantes: 232, docentes: 12, materias: 17 },
  { mes: 'Ene', estudiantes: 238, docentes: 12, materias: 18 },
  { mes: 'Feb', estudiantes: 242, docentes: 12, materias: 18 },
  { mes: 'Mar', estudiantes: 248, docentes: 12, materias: 18 },
];

const materiasRegistradas = [
  { id: 1, nombre: "Matemáticas Avanzadas", docente: "Dr. Carlos Rodríguez", estudiantes: 32, trabajos: 8, promedio: 78, fechaCreacion: "2026-01-15", estado: "Activa" },
  { id: 2, nombre: "Física Moderna", docente: "Dra. Ana Martínez", estudiantes: 28, trabajos: 6, promedio: 82, fechaCreacion: "2026-01-18", estado: "Activa" },
  { id: 3, nombre: "Cálculo Diferencial", docente: "Dr. Carlos Rodríguez", estudiantes: 35, trabajos: 7, promedio: 75, fechaCreacion: "2026-01-15", estado: "Activa" },
  { id: 4, nombre: "Álgebra Lineal", docente: "Dr. Luis González", estudiantes: 30, trabajos: 5, promedio: 80, fechaCreacion: "2026-01-20", estado: "Activa" },
  { id: 5, nombre: "Programación I", docente: "Ing. María López", estudiantes: 42, trabajos: 10, promedio: 84, fechaCreacion: "2026-01-16", estado: "Activa" },
  { id: 6, nombre: "Estructuras de Datos", docente: "Ing. María López", estudiantes: 38, trabajos: 9, promedio: 79, fechaCreacion: "2026-01-17", estado: "Activa" },
];

const docentesData = [
  { id: 1, nombre: "Dr. Carlos Rodríguez", materias: 4, estudiantes: 95, trabajosAsignados: 28, promedioGeneral: 76, especialidad: "Matemáticas" },
  { id: 2, nombre: "Dra. Ana Martínez", materias: 3, estudiantes: 68, trabajosAsignados: 18, promedioGeneral: 81, especialidad: "Física" },
  { id: 3, nombre: "Dr. Luis González", materias: 2, estudiantes: 52, trabajosAsignados: 12, promedioGeneral: 79, especialidad: "Matemáticas" },
  { id: 4, nombre: "Ing. María López", materias: 5, estudiantes: 120, trabajosAsignados: 35, promedioGeneral: 82, especialidad: "Ingeniería" },
];

const estudiantesDestacados = [
  { id: 1, nombre: "Ana García", carrera: "Ingeniería de Sistemas", promedio: 92, materias: 6, trabajosCompletados: 45 },
  { id: 2, nombre: "Carlos Pérez", carrera: "Matemáticas", promedio: 89, materias: 5, trabajosCompletados: 38 },
  { id: 3, nombre: "Laura Martínez", carrera: "Física", promedio: 88, materias: 6, trabajosCompletados: 42 },
  { id: 4, nombre: "Diego Sánchez", carrera: "Ingeniería", promedio: 87, materias: 5, trabajosCompletados: 40 },
  { id: 5, nombre: "María López", carrera: "Ingeniería de Sistemas", promedio: 86, materias: 6, trabajosCompletados: 43 },
];

const rendimientoPorCarrera = [
  { carrera: 'Ingeniería Sistemas', promedio: 79, estudiantes: 95 },
  { carrera: 'Matemáticas', promedio: 77, estudiantes: 52 },
  { carrera: 'Física', promedio: 81, estudiantes: 48 },
  { carrera: 'Química', promedio: 76, estudiantes: 53 },
];

const distribucionEstudiantes = [
  { nombre: 'Activos', value: 215 },
  { nombre: 'Inactivos', value: 23 },
  { nombre: 'Nuevos', value: 10 },
];

const COLORS = ['#10B981', '#F97316', '#7C3AED'];

export default function AdminPage() {
  const [materiasActuales, setMateriasActuales] = useState(materiasRegistradas);
  const [vistaActual, setVistaActual] = useState<'general' | 'materias' | 'docentes' | 'estudiantes'>('general');
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [materiaEliminar, setMateriaEliminar] = useState<number | null>(null);

  const handleEliminarMateria = (id: number) => {
    setMateriaEliminar(id);
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = () => {
    if (materiaEliminar !== null) {
      setMateriasActuales(materiasActuales.filter(m => m.id !== materiaEliminar));
      setMostrarConfirmacion(false);
      setMateriaEliminar(null);
    }
  };

  return (
    <ProtectedRoute requiredRole="admin">

    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-violet-600">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Panel de Administración</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Control total de la plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navegación de vistas */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          <Button
            onClick={() => setVistaActual('general')}
            variant={vistaActual === 'general' ? 'default' : 'outline'}
            className={vistaActual === 'general' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'dark:border-gray-700'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Vista General
          </Button>
          <Button
            onClick={() => setVistaActual('materias')}
            variant={vistaActual === 'materias' ? 'default' : 'outline'}
            className={vistaActual === 'materias' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'dark:border-gray-700'}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Materias
          </Button>
          <Button
            onClick={() => setVistaActual('docentes')}
            variant={vistaActual === 'docentes' ? 'default' : 'outline'}
            className={vistaActual === 'docentes' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'dark:border-gray-700'}
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Docentes
          </Button>
          <Button
            onClick={() => setVistaActual('estudiantes')}
            variant={vistaActual === 'estudiantes' ? 'default' : 'outline'}
            className={vistaActual === 'estudiantes' ? 'bg-violet-600 hover:bg-violet-700 text-white' : 'dark:border-gray-700'}
          >
            <Users className="w-4 h-4 mr-2" />
            Estudiantes
          </Button>
        </div>

        {/* Vista General */}
        {vistaActual === 'general' && (
          <>
            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Estudiantes</CardTitle>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.totalEstudiantes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-emerald-500">+6</span> desde el mes pasado
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Docentes</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.totalDocentes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">4 carreras diferentes</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Materias</CardTitle>
                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                      <BookOpen className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.totalMaterias}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Todas activas</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Trabajos Asignados</CardTitle>
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                      <FileText className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.totalTrabajos}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Este semestre</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio General</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <Award className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.promedioGeneral}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">De 100 puntos</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Tasa de Aprobación</CardTitle>
                    <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                      <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{estadisticasGenerales.tasaAprobacion}%</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <span className="text-emerald-500">+3%</span> vs semestre anterior
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos de crecimiento */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg">Crecimiento de la Plataforma</CardTitle>
                  <CardDescription>Últimos 7 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={crecimientoData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                      <XAxis dataKey="mes" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--tooltip-bg, #FFFFFF)', 
                          borderColor: '#E5E7EB',
                          borderRadius: '8px',
                          color: '#000'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="estudiantes" 
                        stackId="1"
                        stroke="#1D4ED8" 
                        fill="#1D4ED8"
                        fillOpacity={0.6}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="materias" 
                        stackId="2"
                        stroke="#7C3AED" 
                        fill="#7C3AED"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <CardTitle className="text-lg">Distribución de Estudiantes</CardTitle>
                  <CardDescription>Por estado</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribucionEstudiantes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ nombre, percent }) => `${nombre} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribucionEstudiantes.map((entry, index) => (
                          <Cell key={`cell-${entry.nombre}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#FFFFFF', 
                          borderColor: '#E5E7EB',
                          borderRadius: '8px',
                          color: '#000'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Rendimiento por carrera */}
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg">Rendimiento por Carrera</CardTitle>
                <CardDescription>Promedio de estudiantes por programa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={rendimientoPorCarrera}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="carrera" stroke="#6B7280" />
                    <YAxis stroke="#6B7280" domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        color: '#000'
                      }}
                    />
                    <Bar dataKey="promedio" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Vista de Materias */}
        {vistaActual === 'materias' && (
          <>
            <Card className="border-0 shadow-sm mb-6 dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Todas las Materias Registradas</CardTitle>
                    <CardDescription>Total: {materiasActuales.length} materias activas</CardDescription>
                  </div>
                  <BookMarked className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Materia</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Docente</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Estudiantes</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Trabajos</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Promedio</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Fecha Creación</th>
                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-500 dark:text-gray-400">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {materiasActuales.map((materia) => (
                        <tr key={materia.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium">{materia.nombre}</div>
                          </td>
                          <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">{materia.docente}</td>
                          <td className="py-4 px-4 text-center">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                              <Users className="w-3 h-3" />
                              {materia.estudiantes}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">{materia.trabajos}</td>
                          <td className="py-4 px-4 text-center">
                            <span className={`font-semibold ${materia.promedio >= 80 ? 'text-emerald-600 dark:text-emerald-400' : materia.promedio >= 70 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                              {materia.promedio}%
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center text-sm text-gray-500 dark:text-gray-400">{materia.fechaCreacion}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                              </button>
                              <button 
                                onClick={() => handleEliminarMateria(materia.id)}
                                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de estudiantes por materia */}
            <Card className="border-0 shadow-sm dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-lg">Estudiantes por Materia</CardTitle>
                <CardDescription>Distribución de la carga estudiantil</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={materiasActuales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                    <XAxis dataKey="nombre" stroke="#6B7280" angle={-45} textAnchor="end" height={100} />
                    <YAxis stroke="#6B7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#E5E7EB',
                        borderRadius: '8px',
                        color: '#000'
                      }}
                    />
                    <Bar dataKey="estudiantes" fill="#1D4ED8" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {/* Vista de Docentes */}
        {vistaActual === 'docentes' && (
          <>
            <div className="grid grid-cols-1 gap-6">
              {docentesData.map((docente) => (
                <Card key={docente.id} className="border-0 shadow-sm dark:bg-slate-900">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl bg-violet-600">
                          {docente.nombre.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{docente.nombre}</CardTitle>
                          <CardDescription>{docente.especialidad}</CardDescription>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <Eye className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
                      <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="text-2xl font-bold">{docente.materias}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Materias</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="text-2xl font-bold">{docente.estudiantes}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Estudiantes</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="text-2xl font-bold">{docente.trabajosAsignados}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Trabajos Asignados</div>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-800">
                        <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{docente.promedioGeneral}%</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio General</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Desempeño General</div>
                      <Progress value={docente.promedioGeneral} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Vista de Estudiantes */}
        {vistaActual === 'estudiantes' && (
          <>
            <Card className="border-0 shadow-sm mb-6 dark:bg-slate-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Estudiantes Destacados</CardTitle>
                    <CardDescription>Top 5 estudiantes con mejor rendimiento</CardDescription>
                  </div>
                  <Award className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estudiantesDestacados.map((estudiante, index) => (
                    <div 
                      key={estudiante.id}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-sm" 
                        style={{ 
                          backgroundColor: index === 0 ? '#F59E0B' : index === 1 ? '#9CA3AF' : index === 2 ? '#D97706' : '#7C3AED' 
                        }}
                      >
                        {index + 1}
                      </div>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold bg-blue-600">
                        {estudiante.nombre.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{estudiante.nombre}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{estudiante.carrera}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-500 dark:text-emerald-400">{estudiante.promedio}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Promedio</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{estudiante.materias}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Materias</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{estudiante.trabajosCompletados}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Trabajos</div>
                      </div>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Estadísticas de progreso */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">En Riesgo</CardTitle>
                    <AlertCircle className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-orange-500 dark:text-orange-400">18</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio &lt; 60%</p>
                  <div className="mt-3">
                    <Progress value={18} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Regulares</CardTitle>
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">142</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio 60-80%</p>
                  <div className="mt-3">
                    <Progress value={57} />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Sobresalientes</CardTitle>
                    <UserCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-500 dark:text-emerald-400">88</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Promedio &gt; 80%</p>
                  <div className="mt-3">
                    <Progress value={35} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/40">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold">Confirmar Eliminación</h3>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              ¿Estás seguro de que deseas eliminar esta materia? Esta acción no se puede deshacer y se eliminarán todos los trabajos y datos asociados.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => {
                  setMostrarConfirmacion(false);
                  setMateriaEliminar(null);
                }}
                variant="outline"
                className="flex-1 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmarEliminacion}
                variant="destructive"
                className="flex-1"
              >
                Eliminar Materia
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}