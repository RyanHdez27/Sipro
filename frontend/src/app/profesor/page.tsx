"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserNav } from "@/components/UserNav";
import { getProfesorStats } from "@/lib/api";
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { 
  Users, 
  GraduationCap, 
  PieChart as PieChartIcon,
  Loader2,
  BarChart3
} from "lucide-react";

const COLORS_PIE = ['#1D4ED8', '#10B981', '#7C3AED', '#F97316', '#3B82F6', '#8B5CF6'];

export default function ProfesorPage() {
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalCarreras, setTotalCarreras] = useState(0);
  const [distribucionCarreras, setDistribucionCarreras] = useState<{ nombre: string, value: number }[]>([]);
  const [estudiantesBackend, setEstudiantesBackend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfesorStats()
      .then((data) => {
        setTotalEstudiantes(data.total_estudiantes);
        setEstudiantesBackend(data.estudiantes);
        
        const carrerasUnicas = data.distribucion_carreras.filter(
          (d) => d.carrera !== "Sin asignar"
        ).length;
        setTotalCarreras(carrerasUnicas);

        const dist = data.distribucion_carreras.map(c => ({
          nombre: c.carrera,
          value: c.cantidad
        }));
        setDistribucionCarreras(dist);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute requiredRole="profesor">
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header data-tour="profesor-header" className="border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-700">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl">Dashboard Docente</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de carreras y estudiantes</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="h-10 w-10 animate-spin text-blue-700 mb-4" />
            <p className="text-gray-500">Cargando métricas de la plataforma...</p>
          </div>
        ) : (
          <>
            {/* Estadísticas principales */}
            <div data-tour="profesor-stats" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
                  <div className="text-3xl font-bold">{totalEstudiantes}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Registrados en la plataforma
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Carreras Registradas</CardTitle>
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                      <GraduationCap className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalCarreras}</div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Con estudiantes activos</p>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <div data-tour="profesor-content" className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Gráfico Mock Histórico simple */}
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Estudiantes Registrados (Mock Histórico)</CardTitle>
                      <CardDescription>Crecimiento en el tiempo</CardDescription>
                    </div>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={[
                      { mes: 'Ene', estudiantes: Math.max(0, totalEstudiantes - 10) },
                      { mes: 'Feb', estudiantes: Math.max(0, totalEstudiantes - 5) },
                      { mes: 'Mar', estudiantes: totalEstudiantes },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                      <XAxis dataKey="mes" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#F8FAFC'
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

              {/* Gráfico de distribución de estudiantes por carrera */}
              <Card className="border-0 shadow-sm dark:bg-slate-900">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Distribución por Carrera</CardTitle>
                      <CardDescription>Estudiantes inscritos por programa</CardDescription>
                    </div>
                    <PieChartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={distribucionCarreras}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="nombre"
                        label={({ nombre, percent }: any) => percent > 0.05 ? `${nombre} (${(percent * 100).toFixed(0)}%)` : ''}
                      >
                        {distribucionCarreras.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS_PIE[index % COLORS_PIE.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1E293B', 
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#F8FAFC'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Listado de Estudiantes */}
            <Card className="border-0 shadow-sm dark:bg-slate-900 mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Directorio de Estudiantes</CardTitle>
                    <CardDescription>Listado general al que enseñan los docentes</CardDescription>
                  </div>
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800 text-left text-sm text-gray-500 dark:text-gray-400">
                        <th className="pb-3 font-medium">Nombre</th>
                        <th className="pb-3 font-medium">Correo Institucional</th>
                        <th className="pb-3 font-medium">Carrera</th>
                        <th className="pb-3 font-medium">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {estudiantesBackend.map((estudiante) => (
                        <tr key={estudiante.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="py-4 font-medium">{estudiante.name}</td>
                          <td className="py-4 text-gray-600 dark:text-gray-300">{estudiante.email}</td>
                          <td className="py-4 text-gray-600 dark:text-gray-300">{estudiante.carrera || "Sin asignar"}</td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              estudiante.is_active 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              {estudiante.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {estudiantesBackend.length === 0 && (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-gray-500">
                            No hay estudiantes registrados o no se pudo cargar la información.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}