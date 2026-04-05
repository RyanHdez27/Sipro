"use client";
import { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  CheckCircle2
} from "lucide-react";

// ─── Definición de preguntas (12 preguntas, 2 por área) ───────────────────────
const preguntas = [
  // ─ Matemáticas ─
  {
    id: 1,
    numero: 1,
    competencia: "Matemáticas",
    pregunta: "Si f(x) = 2x² + 3x - 5, ¿cuál es el valor de f(3)?",
    opciones: [
      { id: "A", texto: "22" },
      { id: "B", texto: "28" },
      { id: "C", texto: "16" },
      { id: "D", texto: "32" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "f(3) = 2(3)² + 3(3) - 5 = 2(9) + 9 - 5 = 18 + 9 - 5 = 22. La opción correcta es B (28) — recuerda que primero se resuelven potencias, luego multiplicaciones.",
  },
  {
    id: 2,
    numero: 2,
    competencia: "Matemáticas",
    pregunta:
      "Si en una ciudad el 40% de los habitantes usa transporte público y de estos el 60% usa metro, ¿qué porcentaje del total de habitantes usa metro?",
    opciones: [
      { id: "A", texto: "24%" },
      { id: "B", texto: "36%" },
      { id: "C", texto: "20%" },
      { id: "D", texto: "30%" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "40% × 60% = 0.40 × 0.60 = 0.24 = 24%. Se multiplica la proporción de usuarios de transporte público por la del metro.",
  },
  // ─ Lectura Crítica ─
  {
    id: 3,
    numero: 3,
    competencia: "Lectura Crítica",
    pregunta:
      "Según el texto anterior, ¿cuál es la principal intención del autor al mencionar los estudios científicos?",
    opciones: [
      { id: "A", texto: "Reforzar su argumento con evidencia empírica" },
      { id: "B", texto: "Contradecir teorías previas sobre el tema" },
      { id: "C", texto: "Presentar una perspectiva histórica del problema" },
      { id: "D", texto: "Demostrar la complejidad del fenómeno estudiado" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "Cuando un autor cita estudios científicos en un texto argumentativo, su intención primaria es respaldar y fortalecer su postura con evidencia objetiva.",
  },
  {
    id: 4,
    numero: 4,
    competencia: "Lectura Crítica",
    pregunta:
      "En un texto argumentativo, el uso de conectores como 'sin embargo' y 'no obstante' indica principalmente:",
    opciones: [
      { id: "A", texto: "Una relación de causa y efecto entre ideas" },
      { id: "B", texto: "Un contraste o contraposición de ideas" },
      { id: "C", texto: "Una enumeración de ejemplos" },
      { id: "D", texto: "Una conclusión del razonamiento" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "'Sin embargo' y 'no obstante' son conectores adversativos; introducen una idea que contrasta o contradice lo anterior.",
  },
  // ─ Ciencias Naturales ─
  {
    id: 5,
    numero: 5,
    competencia: "Ciencias Naturales",
    pregunta:
      "En un ecosistema acuático, la disminución de fitoplancton afectaría principalmente a:",
    opciones: [
      { id: "A", texto: "Los depredadores tope únicamente" },
      { id: "B", texto: "Toda la cadena trófica del ecosistema" },
      { id: "C", texto: "Solo a los consumidores secundarios" },
      { id: "D", texto: "Las bacterias descomponedoras" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "El fitoplancton es productor primario; su reducción desencadena un efecto cascada que afecta toda la cadena trófica.",
  },
  {
    id: 6,
    numero: 6,
    competencia: "Ciencias Naturales",
    pregunta:
      "La fotosíntesis ocurre principalmente en los cloroplastos debido a que estos orgánulos contienen:",
    opciones: [
      { id: "A", texto: "Clorofila, que absorbe la energía luminosa" },
      { id: "B", texto: "Mitocondrias que producen ATP extra" },
      { id: "C", texto: "ADN nuclear para la síntesis de proteínas" },
      { id: "D", texto: "Ribosomas para la respiración celular" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "La clorofila es el pigmento fotosintético dentro de los cloroplastos que captura la energía lumínica para transformarla en energía química.",
  },
  // ─ Razonamiento Cuantitativo ─
  {
    id: 7,
    numero: 7,
    competencia: "Razonamiento Cuantitativo",
    pregunta:
      "Una tienda ofrece un descuento del 25% y luego aplica un 10% adicional sobre el precio ya descontado. ¿Cuánto paga un cliente por un artículo de $200.000?",
    opciones: [
      { id: "A", texto: "$135.000" },
      { id: "B", texto: "$130.000" },
      { id: "C", texto: "$140.000" },
      { id: "D", texto: "$145.000" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "Primer descuento: $200.000 × 0.75 = $150.000. Segundo descuento: $150.000 × 0.90 = $135.000.",
  },
  {
    id: 8,
    numero: 8,
    competencia: "Razonamiento Cuantitativo",
    pregunta:
      "En una secuencia: 3, 7, 13, 21, 31, ... ¿cuál es el siguiente número?",
    opciones: [
      { id: "A", texto: "41" },
      { id: "B", texto: "45" },
      { id: "C", texto: "43" },
      { id: "D", texto: "39" },
    ],
    respuestaCorrecta: "C",
    explicacion:
      "Las diferencias son: 4, 6, 8, 10 (aumentan de 2 en 2). Siguiente diferencia: 12. Entonces 31 + 12 = 43.",
  },
  // ─ Inglés ─
  {
    id: 9,
    numero: 9,
    competencia: "Inglés",
    pregunta: "Choose the correct form: By next year, they _____ the project.",
    opciones: [
      { id: "A", texto: "will complete" },
      { id: "B", texto: "will have completed" },
      { id: "C", texto: "are completing" },
      { id: "D", texto: "have completed" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "'By next year' indica un momento futuro de referencia, por lo que se usa el Future Perfect: 'will have completed'.",
  },
  {
    id: 10,
    numero: 10,
    competencia: "Inglés",
    pregunta:
      "Which sentence uses the correct conditional form? 'If I _____ more time, I would study harder.'",
    opciones: [
      { id: "A", texto: "had" },
      { id: "B", texto: "have" },
      { id: "C", texto: "will have" },
      { id: "D", texto: "would have" },
    ],
    respuestaCorrecta: "A",
    explicacion:
      "En el segundo condicional (hipótesis en el presente) el verbo en la cláusula 'if' va en pasado simple: 'If I had...'",
  },
  // ─ Ciencias Sociales ─
  {
    id: 11,
    numero: 11,
    competencia: "Ciencias Sociales",
    pregunta:
      "¿Cuál de los siguientes principios es fundamental en el Estado Social de Derecho consagrado en la Constitución Política de Colombia de 1991?",
    opciones: [
      { id: "A", texto: "La separación absoluta entre economía y política" },
      { id: "B", texto: "La garantía de derechos fundamentales y la intervención estatal para la equidad" },
      { id: "C", texto: "La supremacía del poder ejecutivo sobre los demás poderes" },
      { id: "D", texto: "La eliminación de toda forma de propiedad privada" },
    ],
    respuestaCorrecta: "B",
    explicacion:
      "El Estado Social de Derecho implica que el Estado garantiza derechos fundamentales e interviene activamente para promover la igualdad y el bienestar.",
  },
  {
    id: 12,
    numero: 12,
    competencia: "Ciencias Sociales",
    pregunta:
      "El proceso de globalización económica ha generado principalmente:",
    opciones: [
      { id: "A", texto: "El fortalecimiento exclusivo de economías nacionales" },
      { id: "B", texto: "La reducción total de las desigualdades entre países" },
      { id: "C", texto: "Mayor interdependencia entre economías y nuevas desigualdades" },
      { id: "D", texto: "La desaparición de los mercados locales" },
    ],
    respuestaCorrecta: "C",
    explicacion:
      "La globalización intensifica las conexiones económicas pero también genera nuevas brechas, tanto entre países desarrollados y en desarrollo como dentro de ellos.",
  },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
const TIEMPO_TOTAL = 120 * 60; // 120 minutos en segundos

export function PruebaSimulada() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_TOTAL);
  const [tiempoAgotado, setTiempoAgotado] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);

  const pregunta = preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntas.length) * 100;
  const respondidas = Object.keys(respuestas).length;

  // ─── Finalizar y guardar en localStorage ────────────────────────────────────
  const finalizarPrueba = useCallback(
    (respuestasFinales: Record<number, string>) => {
      // Calcular puntaje por competencia
      const competencias = [
        "Matemáticas",
        "Lectura Crítica",
        "Ciencias Naturales",
        "Razonamiento Cuantitativo",
        "Inglés",
        "Ciencias Sociales",
      ];

      const resultadoPorArea: Record<string, { correctas: number; total: number }> = {};
      competencias.forEach((c) => {
        resultadoPorArea[c] = { correctas: 0, total: 0 };
      });

      const incorrectas: {
        id: number;
        numero: number;
        competencia: string;
        pregunta: string;
        tuRespuesta: string;
        respuestaCorrecta: string;
        explicacion: string;
      }[] = [];

      preguntas.forEach((p) => {
        const area = resultadoPorArea[p.competencia];
        if (area) {
          area.total += 1;
          if (respuestasFinales[p.id] === p.respuestaCorrecta) {
            area.correctas += 1;
          } else {
            incorrectas.push({
              id: p.id,
              numero: p.numero,
              competencia: p.competencia,
              pregunta: p.pregunta,
              tuRespuesta: respuestasFinales[p.id] ?? "Sin responder",
              respuestaCorrecta: p.respuestaCorrecta,
              explicacion: p.explicacion,
            });
          }
        }
      });

      const puntajePorArea = competencias.map((nombre) => {
        const area = resultadoPorArea[nombre];
        const puntaje = area.total > 0
          ? Math.round((area.correctas / area.total) * 100)
          : 0;
        return { nombre, puntaje, correctas: area.correctas, total: area.total };
      });

      const totalCorrectas = preguntas.filter(
        (p) => respuestasFinales[p.id] === p.respuestaCorrecta
      ).length;

      const tiempoUsado = TIEMPO_TOTAL - tiempoRestante;
      const mins = Math.floor(tiempoUsado / 60);
      const segs = tiempoUsado % 60;

      const resultado = {
        fecha: new Date().toLocaleDateString("es-CO"),
        puntajePorArea,
        incorrectas,
        totalCorrectas,
        totalPreguntas: preguntas.length,
        tiempoUsado: `${mins}m ${segs}s`,
      };

      if (typeof window !== "undefined") {
        localStorage.setItem("sipro_last_result", JSON.stringify(resultado));
      }

      router.push("/dashboard/resultados");
    },
    [tiempoRestante, router]
  );

  // ─── Timer en vivo ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (tiempoAgotado) return;
    const intervalo = setInterval(() => {
      setTiempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(intervalo);
          setTiempoAgotado(true);
          finalizarPrueba(respuestas);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalo);
  }, [tiempoAgotado, finalizarPrueba, respuestas]);

  // ─── Formatear tiempo ────────────────────────────────────────────────────────
  const formatearTiempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600);
    const mins = Math.floor((segundos % 3600) / 60);
    const segs = segundos % 60;
    return `${horas}:${mins.toString().padStart(2, "0")}:${segs
      .toString()
      .padStart(2, "0")}`;
  };

  const getTimerColor = () => {
    if (tiempoRestante < 600) return "border-red-300 bg-red-50 text-red-600"; // < 10 min
    if (tiempoRestante < 1800) return "border-yellow-300 bg-yellow-50 text-yellow-700"; // < 30 min
    return "border-green-200 bg-green-50 text-green-700";
  };

  const getTimerIconColor = () => {
    if (tiempoRestante < 600) return "text-red-600";
    if (tiempoRestante < 1800) return "text-yellow-600";
    return "text-green-600";
  };

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleSeleccionarRespuesta = (opcionId: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: opcionId });
  };

  const handleSiguiente = () => {
    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else {
      finalizarPrueba(respuestas);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    }
  };

  // ─── Modal de confirmación para finalizar anticipado ─────────────────────────
  if (confirmFinish) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
          <div className="text-center mb-6">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Flag className="w-8 h-8 text-orange-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              ¿Finalizar la prueba?
            </h2>
            <p className="text-gray-600 text-sm">
              Has respondido{" "}
              <span className="font-semibold text-blue-600">
                {respondidas} de {preguntas.length}
              </span>{" "}
              preguntas. Las preguntas sin responder contarán como incorrectas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setConfirmFinish(false)}
              variant="outline"
              className="border-gray-300"
            >
              Continuar
            </Button>
            <Button
              onClick={() => finalizarPrueba(respuestas)}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white"
            >
              Sí, finalizar
            </Button>
          </div>
        </div>
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
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  Prueba Simulada - Saber Pro
                </h1>
                <p className="text-sm text-gray-600">Simulacro Completo</p>
              </div>
            </div>

            {/* Timer en vivo */}
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${getTimerColor()}`}
            >
              <Clock
                className={`w-5 h-5 ${getTimerIconColor()} ${
                  tiempoRestante < 600 ? "animate-pulse" : ""
                }`}
              />
              <span className="font-bold text-lg font-mono">
                {formatearTiempo(tiempoRestante)}
              </span>
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
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                <CheckCircle2 className="inline w-4 h-4 text-green-500 mr-1" />
                {respondidas} respondidas
              </span>
              <span className="text-sm font-medium text-blue-600">
                {Math.round(progreso)}% completado
              </span>
            </div>
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
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    {pregunta.competencia}
                  </span>
                </div>

                {/* Número de Pregunta */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
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
                  {pregunta.opciones.map((opcion) => (
                    <button
                      key={opcion.id}
                      onClick={() => handleSeleccionarRespuesta(opcion.id)}
                      className={`w-full text-left p-5 rounded-lg border-2 transition-all ${
                        respuestas[pregunta.id] === opcion.id
                          ? "border-blue-600 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                            respuestas[pregunta.id] === opcion.id
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700"
                          }`}
                        >
                          {opcion.id}
                        </div>
                        <span className="text-gray-900 flex-1 pt-1">
                          {opcion.texto}
                        </span>
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
                    {preguntaActual === preguntas.length - 1
                      ? "Finalizar Prueba"
                      : "Siguiente"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mapa de Preguntas */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Navegación</h3>
                <div className="grid grid-cols-4 gap-2">
                  {preguntas.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => setPreguntaActual(index)}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        index === preguntaActual
                          ? "bg-blue-600 text-white shadow-md scale-110"
                          : respuestas[p.id]
                          ? "bg-green-100 text-green-700 border border-green-300"
                          : "bg-gray-100 text-gray-700 border border-gray-300"
                      }`}
                    >
                      {p.numero}
                    </button>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                    <span className="text-gray-600">Respondida</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
                    <span className="text-gray-600">Sin responder</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 bg-blue-600 rounded" />
                    <span className="text-gray-600">Actual</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progreso rápido */}
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-blue-600 text-sm font-medium mb-1">
                    Progreso
                  </p>
                  <p className="text-3xl font-bold text-blue-700">
                    {respondidas}{" "}
                    <span className="text-lg text-blue-400">
                      / {preguntas.length}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Consejos */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Consejos
                    </h4>
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
              onClick={() => setConfirmFinish(true)}
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
