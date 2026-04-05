"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Trophy,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Brain,
  Home,
  MessageSquare,
  BookOpen,
  Clock,
  Info,
} from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface AreaResult {
  nombre: string;
  puntaje: number;
  correctas: number;
  total: number;
}

interface Incorrecta {
  id: number;
  numero: number;
  competencia: string;
  pregunta: string;
  tuRespuesta: string;
  respuestaCorrecta: string;
  explicacion: string;
}

interface ResultadoGuardado {
  fecha: string;
  puntajePorArea: AreaResult[];
  incorrectas: Incorrecta[];
  totalCorrectas: number;
  totalPreguntas: number;
  tiempoUsado: string;
}

// ─── Datos de fallback (sin prueba previa) ────────────────────────────────────
const fallbackAreas: AreaResult[] = [
  { nombre: "Matemáticas", puntaje: 0, correctas: 0, total: 2 },
  { nombre: "Lectura Crítica", puntaje: 0, correctas: 0, total: 2 },
  { nombre: "Ciencias Naturales", puntaje: 0, correctas: 0, total: 2 },
  { nombre: "Razonamiento Cuantitativo", puntaje: 0, correctas: 0, total: 2 },
  { nombre: "Inglés", puntaje: 0, correctas: 0, total: 2 },
  { nombre: "Ciencias Sociales", puntaje: 0, correctas: 0, total: 2 },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getColorForScore = (puntaje: number) => {
  if (puntaje >= 80) return "#10b981";
  if (puntaje >= 50) return "#3b82f6";
  return "#f59e0b";
};

const getChartLabel = (nombre: string) => {
  const labels: Record<string, string> = {
    Matemáticas: "Matemáticas",
    "Lectura Crítica": "Lectura",
    "Ciencias Naturales": "Ciencias Nat.",
    "Razonamiento Cuantitativo": "Razonamiento",
    Inglés: "Inglés",
    "Ciencias Sociales": "Ciencias Soc.",
  };
  return labels[nombre] ?? nombre;
};

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-gray-800 text-sm">{label}</p>
        <p
          className="text-sm font-bold"
          style={{ color: getColorForScore(payload[0].value) }}
        >
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

// ─── Componente principal ────────────────────────────────────────────────────
export function Resultados() {
  const router = useRouter();
  const [resultado, setResultado] = useState<ResultadoGuardado | null>(null);
  const [sinPrueba, setSinPrueba] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("sipro_last_result");
      if (raw) {
        try {
          setResultado(JSON.parse(raw));
        } catch {
          setSinPrueba(true);
        }
      } else {
        setSinPrueba(true);
      }
    }
  }, []);

  // ─── Calcular métricas ──────────────────────────────────────────────────────
  const areas = resultado?.puntajePorArea ?? fallbackAreas;
  const totalCorrectas = resultado?.totalCorrectas ?? 0;
  const totalPreguntas = resultado?.totalPreguntas ?? 12;
  const porcentajeTotal =
    totalPreguntas > 0
      ? Math.round((totalCorrectas / totalPreguntas) * 100)
      : 0;
  const incorrectas = resultado?.incorrectas ?? [];
  const fecha = resultado?.fecha ?? "—";
  const tiempoUsado = resultado?.tiempoUsado ?? "—";

  // Generar recomendaciones dinámicas (2 áreas con menor puntaje)
  const areasOrdenadas = [...areas].sort((a, b) => a.puntaje - b.puntaje);
  const areasDebiles = areasOrdenadas.slice(0, 2);
  const areaFuerte = [...areas].sort((a, b) => b.puntaje - a.puntaje)[0];

  const nivelRend =
    porcentajeTotal >= 80
      ? "Excelente"
      : porcentajeTotal >= 60
      ? "Avanzado"
      : porcentajeTotal >= 40
      ? "Intermedio"
      : "En desarrollo";

  // ─── Armar datos para puntaje en puntos (de 100) ──────────────────────────
  const chartData = areas.map((a) => ({
    nombre: getChartLabel(a.nombre),
    puntaje: a.puntaje,
  }));

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
                <h1 className="font-bold text-lg text-gray-900">
                  Resultados de la Prueba
                </h1>
                <p className="text-sm text-gray-600">
                  {sinPrueba
                    ? "Aún no has realizado ninguna prueba"
                    : `Simulacro Saber Pro — ${fecha}`}
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Banner sin prueba */}
      {sinPrueba && (
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              Aún no hay resultados. Realiza tu primera{" "}
              <button
                onClick={() => router.push("/dashboard/prueba-simulada")}
                className="font-semibold underline"
              >
                Prueba Simulada
              </button>{" "}
              para ver tus estadísticas reales aquí.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Puntaje General */}
        <div className="mb-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 opacity-10">
              <Trophy className="w-64 h-64" />
            </div>
            <CardContent className="pt-8 pb-8 relative z-10">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <Trophy className="w-12 h-12 mx-auto mb-3 text-yellow-300" />
                  <p className="text-blue-100 mb-2">Rendimiento Total</p>
                  <p className="text-5xl font-bold mb-2">{porcentajeTotal}%</p>
                  <p className="text-blue-100">Nivel: {nivelRend}</p>
                </div>
                <div className="text-center border-l border-blue-500">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-300" />
                  <p className="text-blue-100 mb-2">Preguntas Correctas</p>
                  <p className="text-5xl font-bold mb-2">{totalCorrectas}</p>
                  <p className="text-blue-100">de {totalPreguntas} preguntas</p>
                </div>
                <div className="text-center border-l border-blue-500">
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
                  <p className="text-blue-100 mb-2">Incorrectas</p>
                  <p className="text-5xl font-bold mb-2">
                    {totalPreguntas - totalCorrectas}
                  </p>
                  <p className="text-blue-100">preguntas a reforzar</p>
                </div>
                <div className="text-center border-l border-blue-500">
                  <Clock className="w-12 h-12 mx-auto mb-3 text-purple-300" />
                  <p className="text-blue-100 mb-2">Tiempo usado</p>
                  <p className="text-3xl font-bold mb-2">{tiempoUsado}</p>
                  <p className="text-blue-100">Fecha: {fecha}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gráfica de Competencias */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Análisis por Competencias
                </CardTitle>
                <CardDescription>
                  Tu desempeño real en cada área evaluada
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="nombre"
                        tick={{ fill: "#6b7280", fontSize: 11 }}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                        tickFormatter={(v) => `${v}%`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="puntaje" radius={[8, 8, 0, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getColorForScore(entry.puntaje)}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-6 space-y-4">
                  {areas.map((area, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {area.nombre}
                        </span>
                        <span
                          className="text-sm font-semibold"
                          style={{ color: getColorForScore(area.puntaje) }}
                        >
                          {area.correctas}/{area.total} correctas &nbsp;({area.puntaje}%)
                        </span>
                      </div>
                      <Progress value={area.puntaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Preguntas Incorrectas */}
            {incorrectas.length > 0 ? (
              <Card className="shadow-md border-gray-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Preguntas Incorrectas — Retroalimentación IA
                  </CardTitle>
                  <CardDescription>
                    Análisis personalizado generado por tu tutor virtual
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {incorrectas.map((pregunta) => (
                      <div
                        key={pregunta.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        {/* Header */}
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                                {pregunta.numero}
                              </div>
                              <div>
                                <span className="text-xs text-gray-500">
                                  Competencia:
                                </span>
                                <p className="text-sm font-medium text-gray-900">
                                  {pregunta.competencia}
                                </p>
                              </div>
                            </div>
                            <XCircle className="w-6 h-6 text-red-500" />
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-4 space-y-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Pregunta:
                            </p>
                            <p className="text-sm text-gray-700">
                              {pregunta.pregunta}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                              <p className="text-xs text-red-600 font-medium mb-1">
                                Tu respuesta:
                              </p>
                              <p className="text-sm font-semibold text-red-700">
                                Opción {pregunta.tuRespuesta}
                              </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                              <p className="text-xs text-green-600 font-medium mb-1">
                                Respuesta correcta:
                              </p>
                              <p className="text-sm font-semibold text-green-700">
                                Opción {pregunta.respuestaCorrecta}
                              </p>
                            </div>
                          </div>

                          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <div className="flex items-start gap-2 mb-2">
                              <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                              <p className="text-sm font-semibold text-blue-900">
                                Explicación del Tutor IA:
                              </p>
                            </div>
                            <p className="text-sm text-blue-900 leading-relaxed">
                              {pregunta.explicacion}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              !sinPrueba && (
                <Card className="shadow-md border-green-200 bg-green-50">
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-bold text-green-900">
                          ¡Perfecto! No tienes preguntas incorrectas.
                        </p>
                        <p className="text-sm text-green-700">
                          Respondiste todas las preguntas correctamente.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Recomendaciones IA dinámicas */}
            <Card className="shadow-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="w-5 h-5 text-blue-600" />
                  Recomendaciones IA
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {areasDebiles.map((area, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">{area.nombre}:</span>{" "}
                        {area.puntaje === 0 && sinPrueba
                          ? "Realiza una prueba para obtener recomendaciones personalizadas."
                          : area.puntaje < 50
                          ? "Necesitas reforzar los conceptos fundamentales de esta área."
                          : "Revisa los temas con errores para mejorar tu puntaje."}
                      </p>
                    </div>
                  ))}
                  {areaFuerte && !sinPrueba && (
                    <div className="flex items-start gap-2">
                      <div className="bg-green-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        ★
                      </div>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Fortaleza:</span> Tu
                        mejor área es{" "}
                        <span className="font-semibold text-green-700">
                          {areaFuerte.nombre}
                        </span>{" "}
                        con {areaFuerte.puntaje}%. ¡Sigue así!
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => router.push("/dashboard/tutor-ia")}
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
                <CardDescription>Refuerza tus áreas débiles</CardDescription>
              </CardHeader>
              <CardContent>
                {sinPrueba ? (
                  <p className="text-sm text-gray-700 mb-4">
                    Realiza primero una prueba simulada para obtener un test de
                    recuperación personalizado.
                  </p>
                ) : (
                  <p className="text-sm text-gray-700 mb-4">
                    Hemos detectado que necesitas reforzar{" "}
                    {areasDebiles.map((a, i) => (
                      <span key={i}>
                        {i > 0 && " y "}
                        <span className="font-semibold">{a.nombre}</span>
                      </span>
                    ))}
                    . Genera un test personalizado enfocado en estas áreas.
                  </p>
                )}
                <Button
                  onClick={() => router.push("/dashboard/test-recuperacion")}
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
                  <span className="text-sm text-gray-600">Tiempo usado</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {tiempoUsado}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precisión</span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: getColorForScore(porcentajeTotal) }}
                  >
                    {porcentajeTotal}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Nivel</span>
                  <span className="text-sm font-semibold text-blue-600">
                    {nivelRend}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Fecha</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {fecha}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Nueva Prueba */}
            <Button
              onClick={() => router.push("/dashboard/prueba-simulada")}
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
