"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Brain,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
  Target,
  ArrowRight,
  BarChart3,
  Calendar,
  Info,
} from "lucide-react";
import { UserNav } from "@/components/UserNav";
import { getCurrentUser } from "@/lib/api";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface AreaResult {
  nombre: string;
  puntaje: number;
  correctas: number;
  total: number;
}

interface HistorialEntry {
  id: number;
  fecha: string;
  puntaje: number;
  correctas: number;
  totalPreguntas: number;
  tiempoUsado: string;
  tipo: string;
}

// ─── Datos de ejemplo (sin prueba previa) ─────────────────────────────────────
const competenciasEjemplo = [
  { competencia: "Matemáticas", puntaje: 0, fullMark: 100 },
  { competencia: "Lectura Crítica", puntaje: 0, fullMark: 100 },
  { competencia: "Ciencias Naturales", puntaje: 0, fullMark: 100 },
  { competencia: "Razonamiento", puntaje: 0, fullMark: 100 },
  { competencia: "Inglés", puntaje: 0, fullMark: 100 },
  { competencia: "Ciencias Sociales", puntaje: 0, fullMark: 100 },
];

const competenciaKeyMap: Record<string, string> = {
  Matemáticas: "Matemáticas",
  "Lectura Crítica": "Lectura Crítica",
  "Ciencias Naturales": "Ciencias Naturales",
  "Razonamiento Cuantitativo": "Razonamiento",
  Inglés: "Inglés",
  "Ciencias Sociales": "Ciencias Sociales",
};

export function Dashboard() {
  const router = useRouter();
  const [competenciasData, setCompetenciasData] = useState(competenciasEjemplo);
  const [historial, setHistorial] = useState<HistorialEntry[]>([]);
  const [hasPrueba, setHasPrueba] = useState(false);
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState({
    porcentajePromedio: 0,
    totalCorrectas: 0,
    totalPreguntas: 12,
    nivelActual: "Sin datos",
    nivelProgress: 0,
  });

  // ─── Leer resultado del localStorage ───────────────────────────────────────
  useEffect(() => {
    getCurrentUser()
      .then((u) => setUserName(u.name?.split(" ")[0] || ""))
      .catch(() => {});

    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("sipro_last_result");
    if (!raw) return;

    try {
      const result = JSON.parse(raw) as {
        fecha: string;
        puntajePorArea: AreaResult[];
        totalCorrectas: number;
        totalPreguntas: number;
        tiempoUsado: string;
      };

      // Actualizar RadarChart
      const nuevasCompetencias = competenciasEjemplo.map((c) => {
        const area = result.puntajePorArea.find(
          (a) => competenciaKeyMap[a.nombre] === c.competencia
        );
        return {
          ...c,
          puntaje: area?.puntaje ?? 0,
        };
      });
      setCompetenciasData(nuevasCompetencias);

      // Stats
      const avg = Math.round(
        nuevasCompetencias.reduce((s, c) => s + c.puntaje, 0) /
          nuevasCompetencias.length
      );
      const nivel =
        avg >= 80
          ? "Experto"
          : avg >= 60
          ? "Avanzado"
          : avg >= 40
          ? "Intermedio"
          : "En desarrollo";
      const nivelProg =
        avg >= 80 ? 90 : avg >= 60 ? 65 : avg >= 40 ? 40 : 15;

      setStats({
        porcentajePromedio: avg,
        totalCorrectas: result.totalCorrectas,
        totalPreguntas: result.totalPreguntas,
        nivelActual: nivel,
        nivelProgress: nivelProg,
      });

      // Historial
      const newEntry: HistorialEntry = {
        id: 1,
        fecha: result.fecha,
        puntaje: result.totalCorrectas,
        correctas: result.totalCorrectas,
        totalPreguntas: result.totalPreguntas,
        tiempoUsado: result.tiempoUsado,
        tipo: "Simulacro Completo",
      };
      setHistorial([newEntry]);
      setHasPrueba(true);
    } catch {
      // silenciar error de parseo
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 dark:from-gray-900 via-white dark:via-gray-950 to-green-50 dark:to-gray-900">
      {/* Header */}
      <header data-tour="student-header" className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900 dark:text-white">
                  SIPRO
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Sistema Inteligente de Preparación para las Pruebas Saber Pro
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100"></p>
                <p className="text-xs text-gray-500 dark:text-gray-400"></p>
              </div>
              <UserNav />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div data-tour="student-welcome" className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            ¡Bienvenido de nuevo{userName ? `, ${userName}` : ""}!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {hasPrueba
              ? "Aquí están tus resultados más recientes. ¡Sigue mejorando!"
              : "Continúa mejorando tus habilidades para el Saber Pro"}
          </p>
        </div>

        {/* Banner sin prueba previa */}
        {!hasPrueba && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              Aún no tienes pruebas realizadas. Las gráficas se actualizarán con
              tus resultados reales una vez completes una{" "}
              <button
                onClick={() => router.push("/dashboard/prueba-simulada")}
                className="font-semibold underline"
              >
                Prueba Simulada
              </button>
              .
            </p>
          </div>
        )}

        {/* Stats Cards */}
        <div data-tour="student-stats" className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Rendimiento</p>
                  <p className="text-3xl font-bold">
                    {hasPrueba ? `${stats.porcentajePromedio}%` : "—"}
                  </p>
                  <p className="text-blue-100 text-xs mt-2">
                    {hasPrueba
                      ? `${stats.totalCorrectas}/${stats.totalPreguntas} correctas`
                      : "Realiza tu primera prueba"}
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
                  <p className="text-3xl font-bold">{historial.length}</p>
                  <p className="text-green-100 text-xs mt-2">
                    {historial.length === 0 ? "Aún sin pruebas" : "Registradas"}
                  </p>
                </div>
                <Target className="w-10 h-10 text-green-200 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Nivel Actual</p>
                  <p className="text-2xl font-bold">{stats.nivelActual}</p>
                  <p className="text-purple-100 text-xs mt-2">
                    {hasPrueba ? "Basado en tu última prueba" : "Sin datos aún"}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-200 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-sm mb-1">Última Prueba</p>
                  <p className="text-2xl font-bold">
                    {hasPrueba ? historial[0]?.fecha : "—"}
                  </p>
                  <p className="text-orange-100 text-xs mt-2">
                    {hasPrueba ? historial[0]?.tiempoUsado : "Sin registro"}
                  </p>
                </div>
                <Clock className="w-10 h-10 text-orange-200 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda — RadarChart */}
          <div className="lg:col-span-2 space-y-6">
            <Card data-tour="student-radar" className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  Análisis de Competencias
                  {!hasPrueba && (
                    <span className="ml-2 text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-normal">
                      Sin datos — realiza una prueba
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {hasPrueba
                    ? "Tu rendimiento real en cada área evaluada"
                    : "Tus resultados aparecerán aquí después de tu primera prueba"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={competenciasData}>
                      <PolarGrid stroke="#e5e7eb" />
                      <PolarAngleAxis
                        dataKey="competencia"
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <PolarRadiusAxis
                        angle={90}
                        domain={[0, 100]}
                        tick={{ fill: "#6b7280", fontSize: 11 }}
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

                {/* Barras de progreso */}
                <div className="mt-6 space-y-4">
                  {competenciasData.map((comp, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {comp.competencia}
                        </span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                          {comp.puntaje}/100
                        </span>
                      </div>
                      <Progress value={comp.puntaje} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* CTA Prueba */}
            <Card className="shadow-md border-2 border-blue-500 bg-gradient-to-br from-blue-50 dark:from-blue-900/20 to-white dark:to-gray-900">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      {hasPrueba
                        ? "¿Lista para otra prueba?"
                        : "¿Listo para una nueva prueba?"}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {hasPrueba
                        ? "Realiza otro simulacro para ver tu progreso y mejorar tu puntaje."
                        : "Inicia un simulacro completo del Saber Pro y mejora tu puntaje."}
                    </p>
                  </div>
                  <BookOpen className="w-16 h-16 text-blue-500 opacity-20" />
                </div>
                <Button
                  onClick={() => router.push("/dashboard/prueba-simulada")}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white w-full"
                  size="lg"
                >
                  {hasPrueba ? "Nueva Prueba Simulada" : "Iniciar Prueba Simulada"}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha */}
          <div data-tour="student-sidebar" className="space-y-6">
            {/* Historial */}
            <Card className="shadow-md border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  Historial de Pruebas
                </CardTitle>
                <CardDescription>Tus últimos resultados</CardDescription>
              </CardHeader>
              <CardContent>
                {historial.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Sin pruebas registradas</p>
                    <p className="text-xs mt-1">
                      Completa tu primera prueba simulada
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historial.map((prueba) => (
                      <div
                        key={prueba.id}
                        className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer border border-gray-200 dark:border-gray-700"
                        onClick={() => router.push("/dashboard/resultados")}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {prueba.fecha}
                          </span>
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {prueba.correctas}/{prueba.totalPreguntas} correctas
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {prueba.tipo}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {prueba.tiempoUsado}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tutor IA */}
            <Card className="shadow-md border-2 border-green-500 bg-gradient-to-br from-green-50 dark:from-green-900/20 to-white dark:to-gray-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-green-600" />
                  Tutor IA Personalizado
                </CardTitle>
                <CardDescription>Obtén ayuda inmediata con IA</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Conversa con tu tutor virtual para resolver dudas, recibir
                  explicaciones y generar ejercicios personalizados.
                </p>
                <Button
                  onClick={() => router.push("/dashboard/tutor-ia")}
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
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Nivel actual
                      </span>
                      <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                        {stats.nivelActual}
                      </span>
                    </div>
                    <Progress value={stats.nivelProgress} className="h-2" />
                  </div>
                  <div className="pt-4 border-t dark:border-gray-800">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                      {hasPrueba ? "Consejo" : "Próxima meta"}
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {hasPrueba
                        ? stats.porcentajePromedio >= 80
                          ? "¡Excelente rendimiento! Sigue practicando para mantenerlo."
                          : "Usa el test de recuperación para reforzar tus áreas débiles."
                        : "Completa tu primera prueba simulada para ver tu nivel real."}
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
