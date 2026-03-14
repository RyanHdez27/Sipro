import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
import { 
  Brain, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Award, 
  Target,
  ArrowRight,
  BarChart3,
  Calendar
} from "lucide-react";
import { UserNav } from "@/components/UserNav";

const competenciasData = [
  { competencia: 'Matemáticas', puntaje: 75, fullMark: 100 },
  { competencia: 'Lectura Crítica', puntaje: 85, fullMark: 100 },
  { competencia: 'Ciencias Naturales', puntaje: 65, fullMark: 100 },
  { competencia: 'Ciencias Sociales', puntaje: 80, fullMark: 100 },
  { competencia: 'Inglés', puntaje: 70, fullMark: 100 },
  { competencia: 'Razonamiento', puntaje: 78, fullMark: 100 },
];

const historialPruebas = [
  { id: 1, fecha: "2026-03-08", puntaje: 245, tiempo: "2h 30min", tipo: "Simulacro Completo" },
  { id: 2, fecha: "2026-03-05", puntaje: 238, tiempo: "2h 45min", tipo: "Simulacro Completo" },
  { id: 3, fecha: "2026-03-01", puntaje: 230, tiempo: "2h 35min", tipo: "Simulacro Completo" },
  { id: 4, fecha: "2026-02-25", puntaje: 220, tiempo: "2h 50min", tipo: "Simulacro Completo" },
];

export function Dashboard() {
  const navigate = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900">SIPRO</h1>
                <p className="text-sm text-gray-600">Sistema Inteligente de Preparación para las Pruebas Saber Pro</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900"></p>
                <p className="text-xs text-gray-500"></p>
              </div>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenida de nuevo, María!</h2>
          <p className="text-gray-600">Continúa mejorando tus habilidades para el Saber Pro</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Puntaje Promedio</p>
                  <p className="text-3xl font-bold">245/300</p>
                  <p className="text-blue-100 text-xs mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +15 pts esta semana
                  </p>
                </div>
                <Award className="w-10 h-10 text-blue-200 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Pruebas Completadas</p>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-green-100 text-xs mt-2">Este mes</p>
                </div>
                <Target className="w-10 h-10 text-green-200 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Tiempo de Estudio</p>
                  <p className="text-3xl font-bold">42h</p>
                  <p className="text-purple-100 text-xs mt-2">Este mes</p>
                </div>
                <Clock className="w-10 h-10 text-purple-200 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Racha Actual</p>
                  <p className="text-3xl font-bold">12 días</p>
                  <p className="text-orange-100 text-xs mt-2">¡Sigue así!</p>
                </div>
                <BarChart3 className="w-10 h-10 text-orange-200 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Radar Chart */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Análisis de Competencias
                </CardTitle>
                <CardDescription>
                  Tu rendimiento en cada área evaluada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={competenciasData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis 
                        dataKey="competencia" 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <PolarRadiusAxis 
                        angle={90} 
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 11 }}
                      />
                      <Radar 
                        name="Puntaje" 
                        dataKey="puntaje" 
                        stroke="#3b82f6" 
                        fill="#3b82f6" 
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Competencias List */}
                <div className="mt-6 space-y-4">
                  {competenciasData.map((comp, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{comp.competencia}</span>
                        <span className="text-sm font-semibold text-blue-600">{comp.puntaje}/100</span>
                      </div>
                      <Progress value={comp.puntaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            <Card className="shadow-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      ¿Listo para una nueva prueba?
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Inicia un simulacro completo del Saber Pro y mejora tu puntaje
                    </p>
                  </div>
                  <BookOpen className="w-16 h-16 text-blue-500 opacity-20" />
                </div>
                <Button 
                  onClick={() => router.push('/prueba-simulada')}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full"
                  size="lg"
                >
                  Iniciar Prueba Simulada
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - History & Tutor */}
          <div className="space-y-6">
            {/* Historial de Resultados */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Historial de Pruebas
                </CardTitle>
                <CardDescription>
                  Tus últimos resultados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {historialPruebas.map((prueba) => (
                    <div 
                      key={prueba.id}
                      className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => router.push('/resultados')}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">{prueba.fecha}</span>
                        <span className="text-sm font-bold text-blue-600">
                          {prueba.puntaje} pts
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900">{prueba.tipo}</p>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {prueba.tiempo}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tutor IA Card */}
            <Card className="shadow-md border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  Tutor IA Personalizado
                </CardTitle>
                <CardDescription>
                  Obtén ayuda inmediata con IA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Conversa con tu tutor virtual para resolver dudas, recibir explicaciones y generar ejercicios personalizados.
                </p>
                <Button 
                  onClick={() => router.push('/tutor-ia')}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white w-full"
                >
                  Abrir Chat con Tutor IA
                  <Brain className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Progreso del Estudiante */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Tu Progreso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-700">Nivel actual</span>
                      <span className="text-sm font-semibold text-purple-600">Avanzado</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500 mb-2">Próxima meta</p>
                    <p className="text-sm font-medium text-gray-900">
                      Completar 5 pruebas más para desbloquear el nivel Experto
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
