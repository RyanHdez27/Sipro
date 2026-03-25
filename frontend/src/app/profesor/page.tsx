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
  ResponsiveContainer 
} from "recharts";
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  TrendingUp, 
  Plus,
  Calendar,
  Clock,
  Award,
  BarChart3,
  PieChart as PieChartIcon,
  Edit,
  Trash2,
  Eye
} from "lucide-react";

// Datos de ejemplo
const estudiantesData = [
  { mes: 'Ene', estudiantes: 45 },
  { mes: 'Feb', estudiantes: 52 },
  { mes: 'Mar', estudiantes: 68 },
];

const materiasData = [
  { id: 1, nombre: "Matemáticas Avanzadas", estudiantes: 32, trabajos: 8, promedioGeneral: 78, color: '#1D4ED8' },
  { id: 2, nombre: "Física Moderna", estudiantes: 28, trabajos: 6, promedioGeneral: 82, color: '#10B981' },
  { id: 3, nombre: "Cálculo Diferencial", estudiantes: 35, trabajos: 7, promedioGeneral: 75, color: '#7C3AED' },
  { id: 4, nombre: "Álgebra Lineal", estudiantes: 30, trabajos: 5, promedioGeneral: 80, color: '#F97316' },
];

const rendimientoPorMateria = [
  { materia: 'Matemáticas', promedio: 78 },
  { materia: 'Física', promedio: 82 },
  { materia: 'Cálculo', promedio: 75 },
  { materia: 'Álgebra', promedio: 80 },
];

const distribucionEstudiantes = [
  { nombre: 'Matemáticas Avanzadas', value: 32 },
  { nombre: 'Física Moderna', value: 28 },
  { nombre: 'Cálculo Diferencial', value: 35 },
  { nombre: 'Álgebra Lineal', value: 30 },
];

const COLORS = ['#1D4ED8', '#10B981', '#7C3AED', '#F97316'];

const trabajosRecientes = [
  { id: 1, titulo: "Examen Parcial - Derivadas", materia: "Cálculo Diferencial", fecha: "2026-03-25", entregas: 28, total: 35 },
  { id: 2, titulo: "Taller - Vectores", materia: "Álgebra Lineal", fecha: "2026-03-24", entregas: 30, total: 30 },
  { id: 3, titulo: "Quiz - Límites", materia: "Cálculo Diferencial", fecha: "2026-03-23", entregas: 33, total: 35 },
  { id: 4, titulo: "Proyecto - Movimiento Circular", materia: "Física Moderna", fecha: "2026-03-22", entregas: 25, total: 28 },
];

export default function ProfesorPage() {
  const [mostrarModalMateria, setMostrarModalMateria] = useState(false);
  const [mostrarModalTrabajo, setMostrarModalTrabajo] = useState(false);
  const [nuevaMateria, setNuevaMateria] = useState({ nombre: "", codigo: "", descripcion: "" });
  const [nuevoTrabajo, setNuevoTrabajo] = useState({ 
    titulo: "", 
    materia: "", 
    descripcion: "", 
    fechaEntrega: "",
    tipo: "taller"
  });

  const handleAgregarMateria = () => {
    console.log("Nueva materia:", nuevaMateria);
    setMostrarModalMateria(false);
    setNuevaMateria({ nombre: "", codigo: "", descripcion: "" });
  };

  const handleAgregarTrabajo = () => {
    console.log("Nuevo trabajo:", nuevoTrabajo);
    setMostrarModalTrabajo(false);
    setNuevoTrabajo({ titulo: "", materia: "", descripcion: "", fechaEntrega: "", tipo: "taller" });
  };

  return (
    <ProtectedRoute requiredRole="profesor">

    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-700">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Dashboard Docente</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de materias y estudiantes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Estudiantes</CardTitle>
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Users className="w-5 h-5 text-blue-700 dark:text-blue-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">125</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span className="text-emerald-500">+12%</span> vs mes anterior
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Materias Activas</CardTitle>
                <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <BookOpen className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">4</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">En este semestre</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Trabajos Asignados</CardTitle>
                <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20">
                  <FileText className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">26</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Este mes</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Promedio General</CardTitle>
                <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <Award className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">79</div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">De 100 puntos</p>
            </CardContent>
          </Card>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={() => setMostrarModalMateria(true)}
            className="text-white bg-blue-700 hover:bg-blue-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Materia
          </Button>
          <Button 
            onClick={() => setMostrarModalTrabajo(true)}
            className="text-white bg-emerald-500 hover:bg-emerald-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Trabajo
          </Button>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de estudiantes registrados */}
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Estudiantes Registrados</CardTitle>
                  <CardDescription>Últimos 3 meses</CardDescription>
                </div>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={estudiantesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                  <XAxis dataKey="mes" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E5E7EB',
                      borderRadius: '8px',
                      color: '#000'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="estudiantes" 
                    stroke="#1D4ED8" 
                    strokeWidth={3}
                    dot={{ fill: '#1D4ED8', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de distribución de estudiantes por materia */}
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Distribución por Materia</CardTitle>
                  <CardDescription>Estudiantes por asignatura</CardDescription>
                </div>
                <PieChartIcon className="w-5 h-5 text-gray-400" />
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={distribucionEstudiantes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ nombre, percent }) => `${nombre.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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

        {/* Rendimiento por materia */}
        <Card className="border-0 shadow-sm mb-8 dark:bg-slate-900">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Rendimiento Promedio por Materia</CardTitle>
                <CardDescription>Promedios generales de cada asignatura</CardDescription>
              </div>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rendimientoPorMateria}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis dataKey="materia" stroke="#6B7280" />
                <YAxis stroke="#6B7280" domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E5E7EB',
                    borderRadius: '8px',
                    color: '#000'
                  }}
                />
                <Bar dataKey="promedio" fill="#1D4ED8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Mis Materias */}
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg">Mis Materias</CardTitle>
              <CardDescription>Asignaturas que imparto</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materiasData.map((materia) => (
                  <div 
                    key={materia.id} 
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{materia.nombre}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {materia.estudiantes} estudiantes
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            {materia.trabajos} trabajos
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                          <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 dark:text-gray-400">Promedio General</span>
                        <span className="font-semibold">{materia.promedioGeneral}%</span>
                      </div>
                      <Progress value={materia.promedioGeneral} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trabajos Recientes */}
          <Card className="border-0 shadow-sm dark:bg-slate-900">
            <CardHeader>
              <CardTitle className="text-lg">Trabajos Recientes</CardTitle>
              <CardDescription>Últimas asignaciones creadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trabajosRecientes.map((trabajo) => (
                  <div 
                    key={trabajo.id}
                    className="p-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{trabajo.titulo}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{trabajo.materia}</p>
                      </div>
                      <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trabajo.fecha}
                      </span>
                      <span>
                        {trabajo.entregas}/{trabajo.total} entregas
                      </span>
                    </div>
                    <Progress value={(trabajo.entregas / trabajo.total) * 100} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal Agregar Materia */}
      {mostrarModalMateria && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4">Agregar Nueva Materia</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre de la Materia
                </label>
                <input
                  type="text"
                  value={nuevaMateria.nombre}
                  onChange={(e) => setNuevaMateria({ ...nuevaMateria, nombre: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  placeholder="Ej: Matemáticas Avanzadas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código
                </label>
                <input
                  type="text"
                  value={nuevaMateria.codigo}
                  onChange={(e) => setNuevaMateria({ ...nuevaMateria, codigo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  placeholder="Ej: MAT301"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevaMateria.descripcion}
                  onChange={(e) => setNuevaMateria({ ...nuevaMateria, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  rows={3}
                  placeholder="Descripción de la materia..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setMostrarModalMateria(false)}
                variant="outline"
                className="flex-1 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAgregarMateria}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white"
              >
                Agregar Materia
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear Trabajo */}
      {mostrarModalTrabajo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold mb-4">Crear Nuevo Trabajo</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del Trabajo
                </label>
                <input
                  type="text"
                  value={nuevoTrabajo.titulo}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, titulo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  placeholder="Ej: Examen Parcial - Derivadas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Materia
                </label>
                <select
                  value={nuevoTrabajo.materia}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, materia: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="">Seleccionar materia...</option>
                  {materiasData.map((materia) => (
                    <option key={materia.id} value={materia.nombre}>
                      {materia.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de Trabajo
                </label>
                <select
                  value={nuevoTrabajo.tipo}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, tipo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                >
                  <option value="taller">Taller</option>
                  <option value="examen">Examen</option>
                  <option value="quiz">Quiz</option>
                  <option value="proyecto">Proyecto</option>
                  <option value="lectura">Lectura</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Fecha de Entrega
                </label>
                <input
                  type="date"
                  value={nuevoTrabajo.fechaEntrega}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, fechaEntrega: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción
                </label>
                <textarea
                  value={nuevoTrabajo.descripcion}
                  onChange={(e) => setNuevoTrabajo({ ...nuevoTrabajo, descripcion: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-800 dark:text-white"
                  rows={3}
                  placeholder="Instrucciones del trabajo..."
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setMostrarModalTrabajo(false)}
                variant="outline"
                className="flex-1 dark:border-gray-700"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAgregarTrabajo}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                Crear Trabajo
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </ProtectedRoute>
  );
}