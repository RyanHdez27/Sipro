"use client";
import { useState } from "react";
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
  Brain,
  ChevronRight,
  ChevronLeft,
  Home,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
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

// ─── Preguntas adaptativas (2 por área débil: Ciencias Naturales + Matemáticas + 2 extra) ─
const preguntasAdaptativas = [
  {
    id: 1,
    numero: 1,
    competencia: "Ciencias Naturales",
    dificultad: "Media",
    pregunta:
      "En un ecosistema marino, ¿qué ocurriría si aumentara significativamente la población de depredadores tope (tiburones)?",
    opciones: [
      { id: "A", texto: "Aumentaría la población de presas directas y disminuiría el fitoplancton" },
      { id: "B", texto: "Disminuiría la población de presas y aumentaría gradualmente el fitoplancton" },
      { id: "C", texto: "No habría cambios en el ecosistema" },
      { id: "D", texto: "Solo afectaría a los productores primarios" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "Los depredadores tope controlan la población de sus presas. Al disminuir las presas (consumidores secundarios), los consumidores primarios crecen y el fitoplancton puede verse afectado positivamente. Este es un ejemplo de cascada trófica.",
  },
  {
    id: 2,
    numero: 2,
    competencia: "Ciencias Naturales",
    dificultad: "Alta",
    pregunta:
      "El proceso de eutrofización en un lago se caracteriza por:",
    opciones: [
      { id: "A", texto: "Exceso de nutrientes que causa proliferación de algas y reducción de oxígeno" },
      { id: "B", texto: "Disminución de nutrientes y aumento de oxígeno" },
      { id: "C", texto: "Incremento en la diversidad de especies" },
      { id: "D", texto: "Estabilización del pH del agua" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "La eutrofización ocurre por exceso de nutrientes (fosfatos, nitratos). Causa crecimiento excesivo de algas; al descomponerse, las bacterias consumen oxígeno, creando zonas hipóxicas que matan a peces y otros organismos.",
  },
  {
    id: 3,
    numero: 3,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "Evalúa g(x) = 3x² - 2x + 4 cuando x = -2",
    opciones: [
      { id: "A", texto: "12" },
      { id: "B", texto: "20" },
      { id: "C", texto: "16" },
      { id: "D", texto: "8" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "g(-2) = 3(-2)² - 2(-2) + 4 = 3(4) + 4 + 4 = 12 + 4 + 4 = 20. Primero resuelve potencias, luego multiplicaciones, finalmente sumas y restas.",
  },
  {
    id: 4,
    numero: 4,
    competencia: "Matemáticas",
    dificultad: "Alta",
    pregunta:
      "Si h(x) = x² + bx + c tiene raíces en x = 2 y x = -3, ¿cuál es el valor de b?",
    opciones: [
      { id: "A", texto: "1" },
      { id: "B", texto: "-1" },
      { id: "C", texto: "5" },
      { id: "D", texto: "-5" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "h(x) = (x-2)(x+3) = x² + x - 6. Por lo tanto b = 1. Recuerda: suma de raíces = -b/a → 2 + (-3) = -1 = -b/1 → b = 1.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getColorForScore = (puntaje: number) => {
  if (puntaje >= 75) return "#10b981";
  if (puntaje >= 50) return "#3b82f6";
  return "#f59e0b";
};

const getDificultadColor = (dificultad: string) => {
  switch (dificultad) {
    case "Alta": return "bg-red-100 text-red-700 border-red-300";
    case "Media": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "Baja": return "bg-green-100 text-green-700 border-green-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// ─── Pantalla de resultados al finalizar ──────────────────────────────────────
function PantallaResultados({
  respuestas,
  onVolver,
}: {
  respuestas: Record<number, string>;
  onVolver: () => void;
}) {
  const router = useRouter();
  const [expandida, setExpandida] = useState<number | null>(null);

  // Calcular resultados por área
  const areaMap: Record<string, { correctas: number; total: number }> = {};
  preguntasAdaptativas.forEach((p) => {
    if (!areaMap[p.competencia]) areaMap[p.competencia] = { correctas: 0, total: 0 };
    areaMap[p.competencia].total += 1;
    if (respuestas[p.id] === p.respuestaCorrecta) {
      areaMap[p.competencia].correctas += 1;
    }
  });

  const resultadoAreas = Object.entries(areaMap).map(([nombre, v]) => ({
    nombre,
    puntaje: Math.round((v.correctas / v.total) * 100),
    correctas: v.correctas,
    total: v.total,
  }));

  const totalCorrectas = preguntasAdaptativas.filter(
    (p) => respuestas[p.id] === p.respuestaCorrecta
  ).length;
  const porcentaje = Math.round((totalCorrectas / preguntasAdaptativas.length) * 100);
  const aprobado = porcentaje >= 75;

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "sipro_recovery_result",
      JSON.stringify({ resultadoAreas, totalCorrectas, porcentaje, fecha: new Date().toLocaleDateString("es-CO") })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Test de Recuperación — Resultados</h1>
              <p className="text-sm text-gray-600">Análisis detallado de tu desempeño</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-gray-300">
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Card de puntaje general */}
        <Card
          className={`shadow-xl border-0 text-white overflow-hidden relative ${
            aprobado
              ? "bg-gradient-to-br from-green-600 to-green-700"
              : "bg-gradient-to-br from-orange-500 to-orange-600"
          }`}
        >
          <div className="absolute top-0 right-0 opacity-10">
            {aprobado ? <CheckCircle2 className="w-48 h-48" /> : <AlertTriangle className="w-48 h-48" />}
          </div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-3 mx-auto">
                  {aprobado
                    ? <CheckCircle2 className="w-12 h-12 text-white" />
                    : <AlertTriangle className="w-12 h-12 text-white" />}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {aprobado ? "¡Excelente trabajo!" : "¡Sigue practicando!"}
                </h2>
                <p className={`text-sm ${aprobado ? "text-green-100" : "text-orange-100"}`}>
                  Has completado el test adaptativo
                </p>
              </div>
              <div>
                <p className={`text-sm mb-2 ${aprobado ? "text-green-100" : "text-orange-100"}`}>Respuestas Correctas</p>
                <p className="text-5xl font-bold">{totalCorrectas}/{preguntasAdaptativas.length}</p>
              </div>
              <div>
                <p className={`text-sm mb-2 ${aprobado ? "text-green-100" : "text-orange-100"}`}>Rendimiento</p>
                <p className="text-5xl font-bold">{porcentaje}%</p>
                <p className={`text-sm mt-2 font-semibold ${aprobado ? "text-green-200" : "text-orange-200"}`}>
                  {aprobado ? "APROBADO" : "A MEJORAR"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica por área */}
          <Card className="shadow-md border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Resultado por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultadoAreas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="nombre" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Puntaje"]} />
                    <Bar dataKey="puntaje" radius={[6, 6, 0, 0]}>
                      {resultadoAreas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColorForScore(entry.puntaje)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {resultadoAreas.map((area, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{area.nombre}</span>
                    <span className="text-sm font-semibold" style={{ color: getColorForScore(area.puntaje) }}>
                      {area.correctas}/{area.total} ({area.puntaje}%)
                    </span>
                  </div>
                  <Progress value={area.puntaje} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recomendaciones dinámicas */}
          <Card className="shadow-md border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Recomendaciones Personalizadas
              </CardTitle>
              <CardDescription>Basadas en tu desempeño</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resultadoAreas.map((area, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    area.puntaje >= 75 ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
                  }`}
                >
                  {area.puntaje >= 75
                    ? <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className={`font-medium text-sm ${area.puntaje >= 75 ? "text-green-900" : "text-orange-900"}`}>
                      {area.nombre}
                    </p>
                    <p className={`text-xs ${area.puntaje >= 75 ? "text-green-700" : "text-orange-700"}`}>
                      {area.puntaje >= 75
                        ? "¡Buen desempeño! Sigue practicando para consolidar."
                        : "Necesita refuerzo. Habla con el Tutor IA para más ejercicios."}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => router.push("/dashboard/tutor-ia")}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Consultar Tutor IA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Revisión pregunta por pregunta */}
        <Card className="shadow-md border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Revisión Detallada — Pregunta por Pregunta
            </CardTitle>
            <CardDescription>
              Haz clic en cada pregunta para ver la explicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preguntasAdaptativas.map((p) => {
              const esCorrecta = respuestas[p.id] === p.respuestaCorrecta;
              const isOpen = expandida === p.id;
              return (
                <div
                  key={p.id}
                  className={`border rounded-lg overflow-hidden transition-all ${
                    esCorrecta ? "border-green-200" : "border-red-200"
                  }`}
                >
                  <button
                    onClick={() => setExpandida(isOpen ? null : p.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between ${
                      esCorrecta ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {esCorrecta
                        ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${esCorrecta ? "text-green-900" : "text-red-900"}`}>
                          Pregunta {p.numero} — {p.competencia}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{p.pregunta}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${
                        isOpen ? "rotate-90" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                      <p className="text-sm text-gray-800">{p.pregunta}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${esCorrecta ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                          <p className="text-xs font-medium text-gray-500 mb-1">Tu respuesta</p>
                          <p className={`text-sm font-semibold ${esCorrecta ? "text-green-700" : "text-red-700"}`}>
                            Opción {respuestas[p.id] ?? "Sin responder"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">Respuesta correcta</p>
                          <p className="text-sm font-semibold text-green-700">
                            Opción {p.respuestaCorrecta}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-blue-900">Explicación del Tutor IA:</p>
                        </div>
                        <p className="text-sm text-blue-900 leading-relaxed">{p.explicacion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Acciones finales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Button>
          <Button
            onClick={() => router.push("/dashboard/prueba-simulada")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Nueva Prueba Simulada
          </Button>
        </div>
      </main>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function TestRecuperacion() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [testCompletado, setTestCompletado] = useState(false);

  const pregunta = preguntasAdaptativas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntasAdaptativas.length) * 100;
  const respuestaSeleccionada = respuestas[pregunta.id];

  const handleSeleccionarRespuesta = (opcionId: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: opcionId });
    setMostrarExplicacion(false);
  };

  const handleVerExplicacion = () => setMostrarExplicacion(true);

  const handleSiguiente = () => {
    if (preguntaActual < preguntasAdaptativas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setMostrarExplicacion(false);
    } else {
      setTestCompletado(true);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
      setMostrarExplicacion(false);
    }
  };

  // ─── Pantalla de resultados ─────────────────────────────────────────────────
  if (testCompletado) {
    return <PantallaResultados respuestas={respuestas} onVolver={() => setTestCompletado(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  Test de Recuperación Adaptativo
                </h1>
                <p className="text-sm text-gray-600">
                  Personalizado según tus áreas de mejora
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {preguntaActual + 1} de {preguntasAdaptativas.length}
            </span>
            <span className="text-sm font-medium text-green-600">
              {Math.round(progreso)}% completado
            </span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pregunta Principal */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                {/* Header con Competencia y Dificultad */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {pregunta.competencia}
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDificultadColor(
                      pregunta.dificultad
                    )}`}
                  >
                    Dificultad: {pregunta.dificultad}
                  </div>
                </div>

                {/* Banner Test Adaptativo */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">
                        Test Adaptativo con IA
                      </p>
                      <p className="text-sm text-green-700">
                        Esta pregunta fue diseñada para reforzar tus áreas de
                        mejora identificadas en evaluaciones anteriores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Número de Pregunta */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                    {pregunta.numero}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Pregunta {pregunta.numero}
                  </h2>
                </div>

                {/* Texto de la Pregunta */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {pregunta.pregunta}
                  </p>
                </div>

                {/* Opciones */}
                <div className="space-y-3">
                  {pregunta.opciones.map((opcion) => {
                    const isSelected = respuestaSeleccionada === opcion.id;
                    const isCorrect = opcion.id === pregunta.respuestaCorrecta;
                    const showResult = mostrarExplicacion;

                    let cls =
                      "w-full text-left p-5 rounded-lg border-2 transition-all ";
                    if (showResult) {
                      if (isCorrect)
                        cls += "border-green-600 bg-green-50";
                      else if (isSelected && !isCorrect)
                        cls += "border-red-600 bg-red-50";
                      else cls += "border-gray-200";
                    } else {
                      cls += isSelected
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50";
                    }

                    return (
                      <button
                        key={opcion.id}
                        onClick={() =>
                          !mostrarExplicacion &&
                          handleSeleccionarRespuesta(opcion.id)
                        }
                        disabled={mostrarExplicacion}
                        className={cls}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                              showResult
                                ? isCorrect
                                  ? "bg-green-600 text-white"
                                  : isSelected && !isCorrect
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                                : isSelected
                                ? "bg-green-600 text-white"
                                : "bg-gray-200 text-gray-700"
                            }`}
                          >
                            {opcion.id}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-gray-900 pt-1">
                              {opcion.texto}
                            </span>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explicación expandible */}
                {mostrarExplicacion && (
                  <div className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">
                          Explicación del Tutor IA:
                        </p>
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {pregunta.explicacion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navegación */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleAnterior}
                    disabled={preguntaActual === 0}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex gap-3">
                    {!mostrarExplicacion && respuestaSeleccionada && (
                      <Button
                        onClick={handleVerExplicacion}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Ver Explicación
                      </Button>
                    )}
                    <Button
                      onClick={handleSiguiente}
                      disabled={!respuestaSeleccionada}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      {preguntaActual === preguntasAdaptativas.length - 1
                        ? "Finalizar Test"
                        : "Siguiente"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progreso */}
            <Card className="shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-green-900">Test Personalizado</h3>
                </div>
                <div className="space-y-2 text-sm text-green-800">
                  <p>✓ Enfocado en tus debilidades</p>
                  <p>✓ Dificultad adaptativa</p>
                  <p>✓ Retroalimentación instantánea</p>
                </div>
              </CardContent>
            </Card>

            {/* Mapa de Preguntas */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Navegación</h3>
                <div className="grid grid-cols-4 gap-2">
                  {preguntasAdaptativas.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPreguntaActual(index);
                        setMostrarExplicacion(false);
                      }}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        index === preguntaActual
                          ? "bg-green-600 text-white shadow-md scale-110"
                          : respuestas[p.id]
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {p.numero}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Consejo IA
                    </h4>
                    <p className="text-sm text-blue-800">
                      Lee la explicación después de cada respuesta para
                      fortalecer tu aprendizaje.
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
