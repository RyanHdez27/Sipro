"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
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
  Lightbulb
} from "lucide-react";

const preguntasAdaptativas = [
  {
    id: 1,
    numero: 1,
    competencia: "Ciencias Naturales",
    dificultad: "Media",
    pregunta: "En un ecosistema marino, ¿qué ocurriría si aumentara significativamente la población de depredadores tope (tiburones)?",
    opciones: [
      { id: "A", texto: "Aumentaría la población de presas directas y disminuiría el fitoplancton" },
      { id: "B", texto: "Disminuiría la población de presas y aumentaría el fitoplancton" },
      { id: "C", texto: "No habría cambios en el ecosistema" },
      { id: "D", texto: "Solo afectaría a los productores primarios" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Los depredadores tope controlan la población de sus presas (consumidores secundarios/terciarios). Si disminuyen las presas, hay menos presión sobre los niveles tróficos inferiores, permitiendo que el fitoplancton aumente. Este es un ejemplo de cascada trófica."
  },
  {
    id: 2,
    numero: 2,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "Evalúa g(x) = 3x² - 2x + 4 cuando x = -2",
    opciones: [
      { id: "A", texto: "12" },
      { id: "B", texto: "20" },
      { id: "C", texto: "16" },
      { id: "D", texto: "8" }
    ],
    respuestaCorrecta: "C",
    explicacion: "g(-2) = 3(-2)² - 2(-2) + 4 = 3(4) + 4 + 4 = 12 + 4 + 4 = 20. Recuerda: primero resuelve potencias, luego multiplicaciones, y finalmente sumas."
  },
  {
    id: 3,
    numero: 3,
    competencia: "Ciencias Naturales",
    dificultad: "Alta",
    pregunta: "El proceso de eutrofización en un lago se caracteriza por:",
    opciones: [
      { id: "A", texto: "Exceso de nutrientes que causa proliferación de algas y reducción de oxígeno" },
      { id: "B", texto: "Disminución de nutrientes y aumento de oxígeno" },
      { id: "C", texto: "Incremento en la diversidad de especies" },
      { id: "D", texto: "Estabilización del pH del agua" }
    ],
    respuestaCorrecta: "A",
    explicacion: "La eutrofización ocurre cuando hay exceso de nutrientes (fosfatos, nitratos). Esto causa: 1) Crecimiento excesivo de algas, 2) Al morir, las bacterias que las descomponen consumen oxígeno, 3) La falta de oxígeno mata a peces y otros organismos. Es un problema ambiental importante."
  },
  {
    id: 4,
    numero: 4,
    competencia: "Matemáticas",
    dificultad: "Alta",
    pregunta: "Si h(x) = x² + bx + c tiene raíces en x = 2 y x = -3, ¿cuál es el valor de b?",
    opciones: [
      { id: "A", texto: "1" },
      { id: "B", texto: "-1" },
      { id: "C", texto: "5" },
      { id: "D", texto: "-5" }
    ],
    respuestaCorrecta: "A",
    explicacion: "Si las raíces son 2 y -3, entonces h(x) = (x-2)(x+3) = x² + 3x - 2x - 6 = x² + x - 6. Por lo tanto, b = 1. Recuerda que la suma de raíces = -b/a, entonces 2 + (-3) = -1 = -b/1, por lo que b = 1."
  }
];

export function TestRecuperacion() {
  const navigate = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [testCompletado, setTestCompletado] = useState(false);

  const pregunta = preguntasAdaptativas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntasAdaptativas.length) * 100;
  const respuestaSeleccionada = respuestas[pregunta.id];

  const handleSeleccionarRespuesta = (opcionId: string) => {
    setRespuestas({
      ...respuestas,
      [pregunta.id]: opcionId
    });
    setMostrarExplicacion(false);
  };

  const handleVerExplicacion = () => {
    setMostrarExplicacion(true);
  };

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

  const calcularResultados = () => {
    let correctas = 0;
    preguntasAdaptativas.forEach(p => {
      if (respuestas[p.id] === p.respuestaCorrecta) {
        correctas++;
      }
    });
    return {
      correctas,
      total: preguntasAdaptativas.length,
      porcentaje: Math.round((correctas / preguntasAdaptativas.length) * 100)
    };
  };

  const getDificultadColor = (dificultad: string) => {
    switch(dificultad) {
      case "Alta": return "bg-red-100 text-red-700 border-red-300";
      case "Media": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Baja": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  if (testCompletado) {
    const resultados = calcularResultados();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-lg text-gray-900">Test Completado</h1>
                  <p className="text-sm text-gray-600">Resultados del Test Adaptativo</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-6 py-8">
          <Card className="shadow-xl border-0 bg-gradient-to-br from-green-600 to-green-700 text-white mb-8">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold mb-2">¡Excelente Trabajo!</h2>
                <p className="text-green-100 mb-6">Has completado el test de recuperación adaptativo</p>
                
                <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Respuestas Correctas</p>
                    <p className="text-4xl font-bold">{resultados.correctas}/{resultados.total}</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Porcentaje</p>
                    <p className="text-4xl font-bold">{resultados.porcentaje}%</p>
                  </div>
                  <div>
                    <p className="text-green-100 text-sm mb-1">Estado</p>
                    <p className="text-2xl font-bold">{resultados.porcentaje >= 75 ? "Aprobado" : "Mejorar"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => router.push('/')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              size="lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Volver al Dashboard
            </Button>
            <Button
              onClick={() => router.push('/tutor-ia')}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
              size="lg"
            >
              <Brain className="w-5 h-5 mr-2" />
              Consultar Tutor IA
            </Button>
          </div>

          <Card className="mt-6 shadow-md border-gray-200">
            <CardHeader>
              <CardTitle>Recomendaciones Personalizadas</CardTitle>
              <CardDescription>Basadas en tu desempeño en este test</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900">Continúa Practicando</p>
                    <p className="text-sm text-blue-700">Realiza tests periódicos para mantener tus conocimientos frescos.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <Target className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-900">Áreas de Fortaleza</p>
                    <p className="text-sm text-green-700">Has mejorado significativamente en {resultados.porcentaje >= 75 ? "todas las áreas" : "varias áreas"}.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
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
                <h1 className="font-bold text-lg text-gray-900">Test de Recuperación Adaptativo</h1>
                <p className="text-sm text-gray-600">Personalizado según tus áreas de mejora</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/')}
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
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDificultadColor(pregunta.dificultad)}`}>
                    Dificultad: {pregunta.dificultad}
                  </div>
                </div>

                {/* Banner de Test Adaptativo */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">Test Adaptativo con IA</p>
                      <p className="text-sm text-green-700">
                        Esta pregunta fue generada específicamente para reforzar tus áreas de mejora identificadas en evaluaciones anteriores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Número de Pregunta */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                    {pregunta.numero}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Pregunta {pregunta.numero}</h2>
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

                    let className = "w-full text-left p-5 rounded-lg border-2 transition-all ";
                    
                    if (showResult) {
                      if (isCorrect) {
                        className += "border-green-600 bg-green-50";
                      } else if (isSelected && !isCorrect) {
                        className += "border-red-600 bg-red-50";
                      } else {
                        className += "border-gray-200";
                      }
                    } else {
                      className += isSelected
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50";
                    }

                    return (
                      <button
                        key={opcion.id}
                        onClick={() => !mostrarExplicacion && handleSeleccionarRespuesta(opcion.id)}
                        disabled={mostrarExplicacion}
                        className={className}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                            showResult
                              ? isCorrect
                                ? "bg-green-600 text-white"
                                : isSelected && !isCorrect
                                ? "bg-red-600 text-white"
                                : "bg-gray-200 text-gray-700"
                              : isSelected
                              ? "bg-green-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}>
                            {opcion.id}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-gray-900 pt-1">{opcion.texto}</span>
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

                {/* Explicación */}
                {mostrarExplicacion && (
                  <div className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">Explicación del Tutor IA:</p>
                        <p className="text-sm text-blue-900 leading-relaxed">{pregunta.explicacion}</p>
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
                      {preguntaActual === preguntasAdaptativas.length - 1 ? 'Finalizar Test' : 'Siguiente'}
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
                      onClick={() => setPreguntaActual(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        index === preguntaActual
                          ? 'bg-green-600 text-white shadow-md'
                          : respuestas[p.id]
                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
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
                    <h4 className="font-semibold text-blue-900 mb-2">Consejo IA</h4>
                    <p className="text-sm text-blue-800">
                      Lee la explicación después de cada pregunta para reforzar tu aprendizaje.
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

