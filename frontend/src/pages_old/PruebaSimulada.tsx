"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Brain,
  Flag,
  AlertCircle
} from "lucide-react";

const preguntas = [
  {
    id: 1,
    numero: 1,
    competencia: "Matemáticas",
    pregunta: "Si f(x) = 2x² + 3x - 5, ¿cuál es el valor de f(3)?",
    opciones: [
      { id: "A", texto: "22" },
      { id: "B", texto: "28" },
      { id: "C", texto: "16" },
      { id: "D", texto: "32" }
    ]
  },
  {
    id: 2,
    numero: 2,
    competencia: "Lectura Crítica",
    pregunta: "Según el texto anterior, ¿cuál es la principal intención del autor al mencionar los estudios científicos?",
    opciones: [
      { id: "A", texto: "Reforzar su argumento con evidencia empírica" },
      { id: "B", texto: "Contradecir teorías previas sobre el tema" },
      { id: "C", texto: "Presentar una perspectiva histórica del problema" },
      { id: "D", texto: "Demostrar la complejidad del fenómeno estudiado" }
    ]
  },
  {
    id: 3,
    numero: 3,
    competencia: "Ciencias Naturales",
    pregunta: "En un ecosistema acuático, la disminución de fitoplancton afectaría principalmente a:",
    opciones: [
      { id: "A", texto: "Los depredadores tope únicamente" },
      { id: "B", texto: "Toda la cadena trófica del ecosistema" },
      { id: "C", texto: "Solo a los consumidores secundarios" },
      { id: "D", texto: "Las bacterias descomponedoras" }
    ]
  },
  {
    id: 4,
    numero: 4,
    competencia: "Razonamiento Cuantitativo",
    pregunta: "Si en una ciudad el 40% de los habitantes usa transporte público y de estos el 60% usa metro, ¿qué porcentaje del total de habitantes usa metro?",
    opciones: [
      { id: "A", texto: "24%" },
      { id: "B", texto: "36%" },
      { id: "C", texto: "20%" },
      { id: "D", texto: "30%" }
    ]
  },
  {
    id: 5,
    numero: 5,
    competencia: "Inglés",
    pregunta: "Choose the correct form: By next year, they _____ the project.",
    opciones: [
      { id: "A", texto: "will complete" },
      { id: "B", texto: "will have completed" },
      { id: "C", texto: "are completing" },
      { id: "D", texto: "have completed" }
    ]
  }
];

export function PruebaSimulada() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiempoRestante, setTiempoRestante] = useState(120); // 120 minutos

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;

  const handleSeleccionarRespuesta = (opcionId: string) => {
    setRespuestas({
      ...respuestas,
      [pregunta.id]: opcionId
    });
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      // Finalizar prueba
      router.push('/dashboard/resultados');
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  const formatearTiempo = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const mins = minutos % 60;
    return `${horas}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Prueba Simulada - Saber Pro</h1>
                <p className="text-sm text-gray-600">Simulacro Completo</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200">
                <Clock className="w-5 h-5 text-red-600" />
                <span className="font-bold text-red-600">{formatearTiempo(tiempoRestante)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {preguntaActual + 1} de {preguntas.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
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
                {/* Etiqueta de Competencia */}
                <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {pregunta.competencia}
                </div>

                {/* Número de Pregunta */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
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
                  {pregunta.opciones.map((opcion) => (
                    <button
                      key={opcion.id}
                      onClick={() => handleSeleccionarRespuesta(opcion.id)}
                      className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                        respuestas[pregunta.id] === opcion.id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                          respuestas[pregunta.id] === opcion.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}>
                          {opcion.id}
                        </div>
                        <span className="text-gray-900 flex-1 pt-1">{opcion.texto}</span>
                      </div>
                    </button>
                  ))}
                </div>

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

                  <Button
                    onClick={handleSiguiente}
                    disabled={!respuestas[pregunta.id]}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    {preguntaActual === preguntas.length - 1 ? 'Finalizar Prueba' : 'Siguiente'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Navegación de Preguntas */}
          <div className="space-y-6">
            {/* Mapa de Preguntas */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Navegación</h3>
                <div className="grid grid-cols-5 gap-2">
                  {preguntas.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => setPreguntaActual(index)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                        index === preguntaActual
                          ? 'bg-blue-600 text-white shadow-md'
                          : respuestas[p.id]
                          ? 'bg-green-100 text-green-700 border border-green-300'
                          : 'bg-gray-100 text-gray-700 border border-gray-300'
                      }`}
                    >
                      {p.numero}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">Respondida</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-gray-600">Sin responder</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información */}
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Consejos</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Lee cuidadosamente cada pregunta</li>
                      <li>• Gestiona bien tu tiempo</li>
                      <li>• Puedes volver a preguntas anteriores</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Finalizar */}
            <Button
              onClick={() => router.push('/dashboard/resultados')}
              variant="outline"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
            >
              <Flag className="w-4 h-4 mr-2" />
              Finalizar Prueba
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

