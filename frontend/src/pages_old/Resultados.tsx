"use client";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { 
  Trophy, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  Brain,
  Home,
  MessageSquare,
  BookOpen
} from "lucide-react";

const puntajePorCompetencia = [
  { nombre: "Matemáticas", puntaje: 75, maximo: 100 },
  { nombre: "Lectura Crítica", puntaje: 85, maximo: 100 },
  { nombre: "Ciencias Nat.", puntaje: 65, maximo: 100 },
  { nombre: "Ciencias Soc.", puntaje: 80, maximo: 100 },
  { nombre: "Inglés", puntaje: 70, maximo: 100 },
];

const preguntasIncorrectas = [
  {
    id: 1,
    numero: 3,
    competencia: "Ciencias Naturales",
    pregunta: "En un ecosistema acuático, la disminución de fitoplancton afectaría principalmente a:",
    tuRespuesta: "A",
    respuestaCorrecta: "B",
    explicacionIA: "La respuesta correcta es B. El fitoplancton es la base de la cadena trófica acuática, siendo productor primario. Su disminución afecta a TODA la cadena trófica porque: 1) Los consumidores primarios (zooplancton) perderían su fuente de alimento, 2) Sin consumidores primarios, los consumidores secundarios y terciarios también se verían afectados. Es un efecto cascada que impacta todo el ecosistema, no solo a los depredadores tope."
  },
  {
    id: 2,
    numero: 1,
    competencia: "Matemáticas",
    pregunta: "Si f(x) = 2x² + 3x - 5, ¿cuál es el valor de f(3)?",
    tuRespuesta: "A",
    respuestaCorrecta: "B",
    explicacionIA: "La respuesta correcta es B (28). Para resolver: f(3) = 2(3)² + 3(3) - 5 = 2(9) + 9 - 5 = 18 + 9 - 5 = 22. Error común: olvidar el orden de operaciones (PEMDAS). Primero se resuelven las potencias, luego multiplicaciones, y finalmente sumas y restas de izquierda a derecha."
  }
];

export function Resultados() {
  const navigate = useRouter();

  const puntajeTotal = 245;
  const puntajeMaximo = 300;
  const porcentajeTotal = Math.round((puntajeTotal / puntajeMaximo) * 100);
  const preguntasCorrectas = 23;
  const preguntasTotales = 25;

  const getColorForScore = (puntaje: number) => {
    if (puntaje >= 80) return "#10b981"; // green
    if (puntaje >= 60) return "#3b82f6"; // blue
    return "#f59e0b"; // orange
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Resultados de la Prueba</h1>
                <p className="text-sm text-gray-600">Simulacro Saber Pro - 11 de Marzo, 2026</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Puntaje General */}
        <div className="mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Trophy className="w-64 h-64" />
            </div>
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                  <p className="text-blue-100 mb-2">Puntaje Total</p>
                  <p className="text-5xl font-bold mb-2">{puntajeTotal}</p>
                  <p className="text-blue-100">de {puntajeMaximo} puntos</p>
                </div>
                <div className="text-center border-l border-r border-blue-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
                  <p className="text-blue-100 mb-2">Preguntas Correctas</p>
                  <p className="text-5xl font-bold mb-2">{preguntasCorrectas}</p>
                  <p className="text-blue-100">de {preguntasTotales} preguntas</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-300" />
                  <p className="text-blue-100 mb-2">Rendimiento</p>
                  <p className="text-5xl font-bold mb-2">{porcentajeTotal}%</p>
                  <p className="text-blue-100">Nivel: Avanzado</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-blue-500">
                <div className="flex items-center justify-center gap-2 text-blue-100">
                  <TrendingUp className="w-5 h-5 text-green-300" />
                  <span>Mejoraste +15 puntos respecto a tu última prueba</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Análisis Detallado */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfica de Competencias */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Análisis por Competencias
                </CardTitle>
                <CardDescription>
                  Tu desempeño en cada área evaluada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={puntajePorCompetencia}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="nombre" 
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <YAxis 
                        domain={[0, 100]}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#fff', 
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="puntaje" radius={[8, 8, 0, 0]}>
                        {puntajePorCompetencia.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColorForScore(entry.puntaje)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-3">
                  {puntajePorCompetencia.map((comp, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{comp.nombre}</span>
                        <span className="text-sm font-semibold" style={{ color: getColorForScore(comp.puntaje) }}>
                          {comp.puntaje}/{comp.maximo}
                        </span>
                      </div>
                      <Progress value={comp.puntaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preguntas Incorrectas */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  Preguntas Incorrectas - Retroalimentación IA
                </CardTitle>
                <CardDescription>
                  Análisis personalizado generado por tu tutor virtual
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {preguntasIncorrectas.map((pregunta) => (
                    <div key={pregunta.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      {/* Header de la pregunta */}
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                              {pregunta.numero}
                            </div>
                            <div>
                              <span className="text-xs text-gray-500">Competencia:</span>
                              <p className="text-sm font-medium text-gray-900">{pregunta.competencia}</p>
                            </div>
                          </div>
                          <XCircle className="w-6 h-6 text-red-500" />
                        </div>
                      </div>

                      {/* Contenido */}
                      <div className="p-4 space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-2">Pregunta:</p>
                          <p className="text-sm text-gray-700">{pregunta.pregunta}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                            <p className="text-xs text-red-600 font-medium mb-1">Tu respuesta:</p>
                            <p className="text-sm font-semibold text-red-700">Opción {pregunta.tuRespuesta}</p>
                          </div>
                          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <p className="text-xs text-green-600 font-medium mb-1">Respuesta correcta:</p>
                            <p className="text-sm font-semibold text-green-700">Opción {pregunta.respuestaCorrecta}</p>
                          </div>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-start gap-2 mb-2">
                            <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm font-semibold text-blue-900">Explicación del Tutor IA:</p>
                          </div>
                          <p className="text-sm text-blue-900 leading-relaxed">
                            {pregunta.explicacionIA}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Acciones */}
          <div className="space-y-6">
            {/* Recomendaciones */}
            <Card className="shadow-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Recomendaciones IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Ciencias Naturales:</span> Debes reforzar conceptos de ecología y cadenas tróficas.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Matemáticas:</span> Practica el orden de operaciones en funciones cuadráticas.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Estrategia:</span> Tu mayor fortaleza es Lectura Crítica. ¡Sigue así!
                    </p>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push('/tutor-ia')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Consultar al Tutor IA
                </Button>
              </CardContent>
            </Card>

            {/* Test de Recuperación */}
            <Card className="shadow-md border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Test Adaptativo
                </CardTitle>
                <CardDescription>
                  Refuerza tus áreas débiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">
                  Hemos detectado que necesitas reforzar <span className="font-semibold">Ciencias Naturales</span> y <span className="font-semibold">Matemáticas</span>.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Genera un test personalizado con preguntas enfocadas en estas áreas.
                </p>
                <Button 
                  onClick={() => router.push('/test-recuperacion')}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                >
                  <Brain className="w-4 h-4 mr-2" />
                  Generar Test de Recuperación
                </Button>
              </CardContent>
            </Card>

            {/* Estadísticas Adicionales */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo total</span>
                  <span className="text-sm font-semibold text-gray-900">2h 30min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tiempo promedio/pregunta</span>
                  <span className="text-sm font-semibold text-gray-900">6 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precisión</span>
                  <span className="text-sm font-semibold text-green-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Ranking nacional</span>
                  <span className="text-sm font-semibold text-blue-600">Top 15%</span>
                </div>
              </CardContent>
            </Card>

            {/* Nueva Prueba */}
            <Button 
              onClick={() => router.push('/prueba-simulada')}
              variant="outline"
              className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
            >
              Iniciar Nueva Prueba
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
