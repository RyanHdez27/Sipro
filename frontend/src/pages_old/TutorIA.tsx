"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "../components/ui/card";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

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

  const handleEnviarMensaje = () => {
    if (inputMensaje.trim() === "") return;

    // Agregar mensaje del usuario
    const nuevoMensajeUsuario: Mensaje = {
      id: mensajes.length + 1,
      tipo: "usuario",
      contenido: inputMensaje,
      timestamp: new Date()
    };

    setMensajes([...mensajes, nuevoMensajeUsuario]);
    setInputMensaje("");
    setIsTyping(true);

    // Simular respuesta de IA con delay
    setTimeout(() => {
      const respuesta = obtenerRespuestaIA(inputMensaje);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">Tutor IA Conversacional</h1>
                <p className="text-sm text-gray-600">Asistente inteligente personalizado</p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/dashboard')}
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
      <main className="max-w-5xl mx-auto px-6 py-8 h-[calc(100vh-120px)] flex flex-col">
        <div className="flex-1 flex flex-col gap-6">
          {/* Chat Container */}
          <Card className="flex-1 shadow-md border-gray-200 flex flex-col overflow-hidden">
            <CardContent className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {mensajes.map((mensaje) => (
                  <div
                    key={mensaje.id}
                    className={`flex gap-3 ${mensaje.tipo === "usuario" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      mensaje.tipo === "ia" 
                        ? "bg-gradient-to-br from-green-500 to-green-600" 
                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                    }`}>
                      {mensaje.tipo === "ia" ? (
                        <Brain className="w-6 h-6 text-white" />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>

                    {/* Mensaje */}
                    <div className={`flex-1 ${mensaje.tipo === "usuario" ? "max-w-md ml-auto" : "max-w-2xl"}`}>
                      <div className={`rounded-2xl p-4 ${
                        mensaje.tipo === "ia"
                          ? "bg-gray-100 text-gray-900"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      }`}>
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{mensaje.contenido}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-2">
                        {mensaje.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="bg-gray-100 rounded-2xl p-4">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>

          {/* Sugerencias Rápidas */}
          {mensajes.length <= 2 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sugerencias.map((sugerencia, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setInputMensaje(sugerencia.texto);
                  }}
                  className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-white hover:border-green-500 hover:bg-green-50 transition-all text-left"
                >
                  <sugerencia.icon className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{sugerencia.texto}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <Card className="shadow-md border-gray-200">
            <CardContent className="pt-4">
              <div className="flex gap-3">
                <Textarea
                  value={inputMensaje}
                  onChange={(e) => setInputMensaje(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Escribe tu pregunta o tema sobre el que necesitas ayuda..."
                  className="min-h-[60px] resize-none border-gray-300 focus:border-green-500"
                />
                <Button
                  onClick={handleEnviarMensaje}
                  disabled={inputMensaje.trim() === "" || isTyping}
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Presiona Enter para enviar, Shift + Enter para nueva línea
              </p>
            </CardContent>
          </Card>

          {/* Action Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={() => router.push('/dashboard/test-recuperacion')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generar Test de Recuperación
            </Button>
            <Button
              onClick={() => router.push('/dashboard/resultados')}
              variant="outline"
              className="border-gray-300"
              size="lg"
            >
              Ver Mis Resultados
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

