import { TourStep } from "@/components/GuidedTour";

/* ═══ ADMIN ═══ */
export const adminTourSteps: TourStep[] = [
  {
    selector: "[data-tour='admin-header']",
    title: "Panel de Administración",
    description: "Este es tu centro de control. Desde aquí supervisas toda la plataforma SIPRO UDC: usuarios, rendimiento académico y configuración del sistema.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='admin-nav']",
    title: "Navegación por Secciones",
    description: "Usa estos botones para alternar entre las vistas: Vista General (métricas), Materias (rendimiento por área), Docentes (profesores registrados) y Estudiantes (ranking y clasificación).",
    placement: "bottom",
  },
  {
    selector: "[data-tour='admin-stats']",
    title: "Métricas en Tiempo Real",
    description: "Estas 4 tarjetas muestran datos reales de la plataforma: Total de Estudiantes y Docentes (desde la base de datos), Promedio General y Tasa de Aprobación de todas las pruebas.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='admin-charts']",
    title: "Gráficas Interactivas",
    description: "Visualiza el crecimiento de la plataforma, la distribución de estudiantes por estado y el rendimiento promedio en cada una de las 6 competencias del Saber Pro.",
    placement: "top",
  },
  {
    selector: "[data-tour='user-nav']",
    title: "Menú de Usuario",
    description: "Desde aquí accedes a la Configuración del sistema (códigos de docente, seguridad, notificaciones), puedes volver a ver este tutorial o cerrar sesión.",
    placement: "bottom",
  },
];

/* ═══ ESTUDIANTE ═══ */
export const estudianteTourSteps: TourStep[] = [
  {
    selector: "[data-tour='student-header']",
    title: "Tu Plataforma SIPRO",
    description: "Bienvenido al Sistema Inteligente de Preparación para las Pruebas Saber Pro. Desde aquí accedes a todas las herramientas de estudio y seguimiento.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='student-welcome']",
    title: "Panel de Bienvenida",
    description: "Aquí verás tu nombre y un mensaje personalizado. Una vez completes tu primera prueba, se actualizará con información de tu rendimiento más reciente.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='student-stats']",
    title: "Tus Estadísticas",
    description: "Estas tarjetas muestran tu rendimiento: porcentaje promedio, nivel de progreso, total de aciertos y posición en el ranking. Se actualizan automáticamente tras cada prueba.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='student-radar']",
    title: "Radar de Competencias",
    description: "Este gráfico muestra tu puntaje en las 6 áreas del Saber Pro: Matemáticas, Lectura Crítica, Ciencias Naturales, Razonamiento Cuantitativo, Inglés y Ciencias Sociales.",
    placement: "right",
  },
  {
    selector: "[data-tour='student-sidebar']",
    title: "Accesos Rápidos",
    description: "Desde aquí accedes directamente a: Prueba Simulada (12 preguntas, 120 min), Resultados Detallados, Tutor con IA y tu historial de pruebas realizadas.",
    placement: "left",
  },
  {
    selector: "[data-tour='user-nav']",
    title: "Tu Perfil",
    description: "Accede a tu Configuración para personalizar objetivos, áreas de interés, notificaciones y seguridad. También puedes volver a ver este tutorial en cualquier momento.",
    placement: "bottom",
  },
];

/* ═══ PROFESOR ═══ */
export const profesorTourSteps: TourStep[] = [
  {
    selector: "[data-tour='profesor-header']",
    title: "Panel del Docente",
    description: "Bienvenido a tu centro de gestión académica. Aquí supervisas el progreso de tus estudiantes y gestionas tus materias en la plataforma SIPRO UDC.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='profesor-stats']",
    title: "Resumen de Actividad",
    description: "Estas tarjetas muestran un resumen de tu actividad: estudiantes asignados, materias que impartes, trabajos pendientes y promedio general de tu grupo.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='profesor-content']",
    title: "Contenido del Panel",
    description: "Aquí encontrarás las herramientas principales de gestión: actividad reciente de estudiantes, rendimiento por área y accesos directos a tus recursos.",
    placement: "top",
  },
  {
    selector: "[data-tour='user-nav']",
    title: "Configuración",
    description: "Accede a tu perfil, gestiona materias, cambia contraseña, activa 2FA y configura preferencias de calificación. También puedes repetir este tutorial.",
    placement: "bottom",
  },
];

/* ═══ CONFIG: ADMIN ═══ */
export const adminConfigTourSteps: TourStep[] = [
  {
    selector: "[data-tour='config-header']",
    title: "Configuración de Administrador",
    description: "Desde aquí gestionas todos los aspectos de la plataforma: tu perfil, los accesos de docentes, la seguridad del sistema y las notificaciones masivas.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-tabs']",
    title: "Pestañas de Configuración",
    description: "Navega entre las secciones: Perfil (datos personales), Accesos (códigos y registro de docentes), Seguridad (logs de login y límites) y Notificaciones (mensajes masivos).",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-codes']",
    title: "Generación de Códigos",
    description: "Aquí generas códigos únicos (DOC-XXXXXX) para que los docentes puedan registrarse. Los códigos expiran a los 8 días y son de un solo uso. Se guardan en la base de datos.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-codes-log']",
    title: "Log de Códigos",
    description: "Historial de todos los códigos generados con su estado (Activo, Usado, Expirado). Puedes copiar o revocar códigos activos. Se sincroniza en tiempo real con el backend.",
    placement: "top",
  },
  {
    selector: "[data-tour='config-register']",
    title: "Registro de Docentes",
    description: "Registra profesores directamente desde aquí. Puedes hacerlo manualmente (nombre + email + contraseña) o usando un código de invitación. Ambos métodos persisten en la base de datos.",
    placement: "top",
  },
  {
    selector: "[data-tour='config-home']",
    title: "Volver al Dashboard",
    description: "Haz clic en el ícono de casa para regresar al panel principal del administrador en cualquier momento.",
    placement: "bottom",
  },
];

/* ═══ CONFIG: ESTUDIANTE ═══ */
export const estudianteConfigTourSteps: TourStep[] = [
  {
    selector: "[data-tour='config-header']",
    title: "Tu Configuración Personal",
    description: "Aquí personalizas toda tu experiencia en SIPRO UDC: datos personales, objetivos académicos, seguimiento de progreso y opciones de seguridad.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-tabs']",
    title: "Secciones Disponibles",
    description: "Navega entre: Perfil (datos personales y académicos), Académico (objetivos y áreas de interés), Progreso (gráficas y logros) y Seguridad (contraseña y 2FA).",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-motivation']",
    title: "Indicadores Motivacionales",
    description: "Estos banners te muestran qué tan cerca estás de tu objetivo de puntaje y te dan recomendaciones inteligentes basadas en las áreas donde más necesitas mejorar.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-content']",
    title: "Contenido de la Sección",
    description: "Cada pestaña muestra información detallada. En Perfil verás tus datos y progreso, en Académico tus objetivos, en Progreso tus logros y gráficas, y en Seguridad tus opciones de protección.",
    placement: "top",
  },
  {
    selector: "[data-tour='config-home']",
    title: "Volver al Dashboard",
    description: "Haz clic en el ícono de casa para regresar a tu panel principal de estudiante.",
    placement: "bottom",
  },
];

/* ═══ CONFIG: PROFESOR ═══ */
export const profesorConfigTourSteps: TourStep[] = [
  {
    selector: "[data-tour='config-header']",
    title: "Configuración del Docente",
    description: "Desde aquí administras tu cuenta, materias que impartes y preferencias académicas para gestionar mejor a tus estudiantes.",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-tabs']",
    title: "Secciones de Configuración",
    description: "Navega entre: Perfil (datos personales y materias), Cuenta (contraseña, 2FA, notificaciones e idioma) y Académicas (tipos de trabajos, escalas y plazos).",
    placement: "bottom",
  },
  {
    selector: "[data-tour='config-content']",
    title: "Contenido de la Sección",
    description: "Cada pestaña tiene opciones específicas. En Perfil puedes agregar/eliminar materias, en Cuenta configurar seguridad y notificaciones, y en Académicas personalizar tus criterios de evaluación.",
    placement: "top",
  },
  {
    selector: "[data-tour='config-home']",
    title: "Volver al Dashboard",
    description: "Haz clic en el ícono de casa para regresar a tu panel principal de docente.",
    placement: "bottom",
  },
];
