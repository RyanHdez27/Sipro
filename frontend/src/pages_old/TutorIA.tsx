"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { 
  Brain, 
  Send, 
  Home,
  Sparkles,
  BookOpen,
  Lightbulb,
  User
} from "lucide-react";

interface Mensaje {
  id: number;
  tipo: "usuario" | "ia";
  contenido: string;
  timestamp: Date;
}

const mensajesIniciales: Mensaje[] = [
  {
    id: 1,
    tipo: "ia",
    contenido: "¡Hola María! 👋 Soy tu tutor virtual con inteligencia artificial. He analizado tus últimos resultados y estoy aquí para ayudarte a mejorar. ¿En qué área te gustaría trabajar hoy?",
    timestamp: new Date(Date.now() - 60000)
  }
];

export function TutorIA() {
  const router = useRouter();
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesIniciales);
  const [inputMensaje, setInputMensaje] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, isTyping]);

  const respuestasIA: Record<string, string> = {
    "ciencias naturales": "Excelente elección. He notado que en tu última prueba tuviste dificultades con preguntas sobre ecosistemas y cadenas tróficas. Específicamente, la pregunta sobre el impacto de la disminución del fitoplancton. \n\nEl fitoplancton es fundamental porque:\n\n1️⃣ Son productores primarios (hacen fotosíntesis)\n2️⃣ Base de toda la cadena alimenticia acuática\n3️⃣ Producen gran parte del oxígeno del planeta\n\n¿Te gustaría que profundice en alguno de estos puntos o prefieres que generemos ejercicios prácticos sobre este tema?",
    "matemáticas": "Perfecto. En tu última evaluación tuviste un error en la función cuadrática f(x) = 2x² + 3x - 5. El problema común aquí es el orden de operaciones.\n\nRecuerda PEMDAS:\n• Paréntesis\n• Exponentes\n• Multiplicación y División (izquierda a derecha)\n• Adición y Sustracción (izquierda a derecha)\n\nPara f(3):\n1. Primero: 3² = 9\n2. Luego: 2(9) = 18\n3. Después: 3(3) = 9\n4. Finalmente: 18 + 9 - 5 = 22\n\n¿Quieres practicar con más ejercicios similares?",
    "ejercicios": "¡Me encanta tu actitud! Voy a generar un test personalizado basado en tus áreas de mejora. El test incluirá:\n\n📊 10 preguntas adaptadas a tu nivel\n🎯 Enfocadas en Ciencias Naturales y Matemáticas\n🧠 Dificultad progresiva según tus respuestas\n⏱️ Sin límite de tiempo (enfócate en aprender)\n\n¿Listo para comenzar? Presiona el botón 'Generar Test de Recuperación' debajo.",
    "default": "Entiendo tu pregunta. Puedo ayudarte con:\n\n• Explicaciones detalladas de temas específicos\n• Resolución paso a paso de ejercicios\n• Estrategias para mejorar en cada competencia\n• Generación de tests personalizados\n\n¿Sobre qué tema específico te gustaría que conversemos?"
  };

  const obtenerRespuestaIA = (mensaje: string): string => {
    const mensajeLower = mensaje.toLowerCase();
    
    if (mensajeLower.includes("ciencias") || mensajeLower.includes("ecosistema") || mensajeLower.includes("biología")) {
      return respuestasIA["ciencias naturales"];
    } else if (mensajeLower.includes("matemática") || mensajeLower.includes("función") || mensajeLower.includes("cálculo")) {
      return respuestasIA["matemáticas"];
    } else if (mensajeLower.includes("ejercicio") || mensajeLower.includes("práctica") || mensajeLower.includes("test")) {
      return respuestasIA["ejercicios"];
    } else {
      return respuestasIA["default"];
    }
  };

  const enviarMensaje = (texto: string) => {
    const textoLimpio = texto.trim();
    if (textoLimpio === "") return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario: Mensaje = {
      id: mensajes.length + 1,
      tipo: "usuario",
      contenido: textoLimpio,
      timestamp: new Date()
    };

    setMensajes([...mensajes, nuevoMensajeUsuario]);
    setInputMensaje("");
    setIsTyping(true);

    // Simular respuesta de IA con delay
    setTimeout(() => {
      const respuesta = obtenerRespuestaIA(textoLimpio);
      const nuevoMensajeIA: Mensaje = {
        id: mensajes.length + 2,
        tipo: "ia",
        contenido: respuesta,
        timestamp: new Date()
      };
      setMensajes(prev => [...prev, nuevoMensajeIA]);
      setIsTyping(false);
    }, 1500);
  };

  const handleEnviarMensaje = () => {
    enviarMensaje(inputMensaje);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviarMensaje();
    }
  };

  const sugerencias = [
    { icon: BookOpen, texto: "Explícame sobre ecosistemas acuáticos", tema: "ciencias naturales" },
    { icon: Lightbulb, texto: "Ayúdame con funciones cuadráticas", tema: "matemáticas" },
    { icon: Sparkles, texto: "Generar ejercicios de práctica", tema: "ejercicios" }
  ];

  const formatTimestamp = (timestamp: Date) =>
    timestamp.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" });

  const mensajesRespondidos = mensajes.filter((mensaje) => mensaje.tipo === "usuario").length;

  return (
    <div className="h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_25%),linear-gradient(180deg,_#f8fbff_0%,_#eef7f3_100%)]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/70 bg-white/85 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-lg shadow-emerald-200/60">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold text-slate-900 sm:text-lg">Tutor IA Conversacional</h1>
                <span className="hidden rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 sm:inline-flex">
                  En línea
                </span>
              </div>
              <p className="truncate text-xs text-slate-500 sm:text-sm">Asistente inteligente personalizado para tu preparación Saber Pro</p>
            </div>
          </div>
          <Button 
              onClick={() => router.push('/dashboard')}
              variant="outline"
              className="shrink-0 border-slate-300 bg-white/80 text-slate-700"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Volver al Dashboard</span>
              <span className="sm:hidden">Inicio</span>
            </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex h-[calc(100vh-73px)] max-w-7xl min-h-0 w-full flex-col px-4 py-3 sm:px-6 sm:py-4">
        <div className="grid min-h-0 flex-1 gap-3 xl:grid-cols-[minmax(0,1.72fr)_300px]">
          <Card className="flex min-h-0 flex-1 flex-col overflow-hidden border-white/70 bg-white/80 shadow-xl shadow-slate-200/70 backdrop-blur">
            <CardContent className="flex min-h-0 flex-1 flex-col p-0">
              <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5"
              >
                <div className="mx-auto flex max-w-4xl flex-col gap-4">
                  {mensajes.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className={`flex items-end gap-3 ${mensaje.tipo === "usuario" ? "justify-end" : "justify-start"}`}
                    >
                      {mensaje.tipo === "ia" && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200/70">
                          <Brain className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <div className={`max-w-[90%] sm:max-w-[78%] ${mensaje.tipo === "usuario" ? "items-end" : "items-start"} flex flex-col`}>
                        <div
                          className={`rounded-[22px] px-4 py-2.5 shadow-sm sm:px-4 ${
                            mensaje.tipo === "ia"
                              ? "border border-slate-200 bg-white text-slate-900"
                              : "bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_50%,#0f766e_100%)] text-white"
                          }`}
                        >
                          <p className="whitespace-pre-wrap break-words text-sm leading-6">{mensaje.contenido}</p>
                        </div>
                        <p className="mt-1.5 px-2 text-[11px] font-medium text-slate-400">
                          {mensaje.tipo === "ia" ? "Tutor IA" : "Tú"} · {formatTimestamp(mensaje.timestamp)}
                        </p>
                      </div>
                      {mensaje.tipo === "usuario" && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-200/70">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-end gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-md shadow-emerald-200/70">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div className="rounded-[22px] border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
                        <div className="flex gap-1.5">
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                          <div className="h-2.5 w-2.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.35),rgba(255,255,255,0.96))] px-4 py-3 backdrop-blur sm:px-5">
                {mensajes.length <= 2 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {sugerencias.map((sugerencia, index) => (
                      <button
                        key={index}
                        onClick={() => enviarMensaje(sugerencia.texto)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-left text-sm text-slate-700 shadow-sm transition-all hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                      >
                        <sugerencia.icon className="h-4 w-4 text-emerald-600" />
                        <span>{sugerencia.texto}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/60">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                    <Textarea
                      value={inputMensaje}
                      onChange={(e) => setInputMensaje(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Escribe tu pregunta, pide una explicación o solicita ejercicios personalizados..."
                      className="min-h-[40px] border-0 bg-transparent px-3 py-2.5 text-sm leading-6 shadow-none focus-visible:ring-0"
                    />
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <p className="px-2 text-[11px] text-slate-400 sm:hidden">
                        Enter envía · Shift + Enter nueva línea
                      </p>
                      <Button
                        onClick={handleEnviarMensaje}
                        disabled={inputMensaje.trim() === "" || isTyping}
                        className="h-11 rounded-2xl bg-[linear-gradient(135deg,#059669_0%,#047857_100%)] px-5 text-white shadow-md shadow-emerald-200/70 hover:from-emerald-700 hover:to-emerald-800"
                      >
                        <Send className="h-4 w-4" />
                        <span className="ml-2">Enviar</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <p className="mt-2 hidden px-2 text-[11px] text-slate-400 sm:block">
                  Presiona Enter para enviar, Shift + Enter para nueva línea
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid min-h-0 gap-3 xl:grid-cols-1">
            <div className="rounded-3xl border border-white/70 bg-white/75 p-3 shadow-lg shadow-slate-200/60 backdrop-blur">
              <p className="px-1 pb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Accesos rápidos
              </p>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-1">
                <Button
                  onClick={() => router.push('/dashboard/test-recuperacion')}
                  className="group h-auto justify-start rounded-2xl bg-[linear-gradient(135deg,#2563eb_0%,#1d4ed8_100%)] px-4 py-3 text-white shadow-md shadow-blue-200/70 hover:from-blue-700 hover:to-blue-800"
                >
                  <div className="flex min-w-0 items-start gap-3 text-left">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/18 ring-1 ring-white/20 transition-transform group-hover:scale-105">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="whitespace-normal break-words text-sm font-semibold leading-5">
                        Generar Test de Recuperación
                      </span>
                      <span className="mt-1 whitespace-normal break-words text-xs leading-5 text-blue-100/90">
                        Practica con preguntas adaptativas según tu desempeño
                      </span>
                    </div>
                  </div>
                </Button>
                <Button
                  onClick={() => router.push('/dashboard/resultados')}
                  variant="outline"
                  className="group h-auto justify-start rounded-2xl border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm hover:border-slate-300 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-start gap-3 text-left">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-200">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="whitespace-normal break-words text-sm font-semibold leading-5">
                        Ver Mis Resultados
                      </span>
                      <span className="mt-1 whitespace-normal break-words text-xs leading-5 text-slate-500">
                        Revisa tu evolución y las recomendaciones del tutor
                      </span>
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
