# Manual Técnico - SIPRO UDC

## 1. Introducción
**Descripción general del sistema:**
SIPRO UDC (Sistema Integral de Preparación para el Saber Pro - UDC) es una plataforma web Full-Stack diseñada para brindar aprendizaje adaptativo asistido por Inteligencia Artificial. Está enfocada en preparar a los estudiantes de la universidad para las pruebas analíticas estándar, proporcionando un entorno con tres perspectivas: Estudiante, Profesor y Administrador.

**Objetivo del proyecto:**
Proveer una herramienta integral, adaptativa y escalable que permita a los estudiantes evaluar y mejorar sus competencias genéricas (Matemáticas, Lectura Crítica, Ciencias Naturales, Razonamiento Cuantitativo, Inglés y Ciencias Sociales) bajo la intervención de un Tutor virtual impulsado con IA.

**Alcance:**
El sistema permite el registro segmentado de usuarios mediante control criptográfico (códigos administrativos), evaluación heurística temporalizada (pruebas de 120 minutos en vivo), análisis de competencias mediante gráficas y gestión centralizada de métricas institucionales para los coordinadores de área.

---

## 2. Arquitectura del sistema
**Diagrama lógico:**
La arquitectura del sistema sigue un modelo Cliente-Servidor (Decoupled Frontend-Backend):
- **Capa de Presentación (Frontend/Cliente):** Desarrollada en **React y Next.js 14** usando el "App Router", gestiona la interfaz gráfica, el enrutamiento protegido y la visualización de datos usando TailwindCSS, Shadcn/ui y Recharts. Peticiones HTTP aisladas vía Axios/Fetch centralizados.
- **Capa de Negocio (Backend/API):** Construida con **Python y FastAPI**, expone una API RESTful que centraliza la lógica de registro, autenticación, validación de cuotas (Rate Limit Middleware) y recolección analítica de progreso.
- **Capa de Persistencia (Base de Datos):** Ecosistema Relacional SQL basado en **PostgreSQL** (alojado en la nube con Supabase), manipulado de forma programática y asíncrona mediante el motor central ORM **SQLAlchemy**.
- **Capa de Seguridad:** Middleware robusto de FastAPI controlando payloads grandes, Middlewares CORS de acceso cruzado, validación estructural de schemas con **Pydantic**, contraseñas cifradas vía *Bcrypt* y control de estado sin memoria con **JSON Web Tokens (JWT)**.

**Patrones de diseño utilizados:**
- **MVC/MVT Adaptado:** Separación drástica de vistas reactivas (Frontend Next.js) respecto a modelos abstractos y controladores (FastAPI routes/models).
- **Inyección de Dependencias (DI):** Explotada integralmente en FastAPI (ej. inyección por argumento `Depends(get_current_user)`, de base de datos `SessionLocal`).
- **Singleton:** El cliente API frontend centraliza una única instancia/servicio interceptor para toda petición remota (`api.ts`).
- **Role-Based Access Control (RBAC):** Escalado de privilegios mapeado por enumeraciones guardadas directamente dentro del claim de seguridad del JWT e inyectado a los Guards (`ProtectedRoute.tsx`).

---

## 3. Requisitos
**Requisitos funcionales:**
- Registro de actores académicos. Las cuentas Docente son aisladas, exigen código tokenizado ("DOC-XXXX") de corto plazo (8 días de expiración) y son únicas por solicitud.
- Ejecución ininterrumpida de "Prueba Simulada Saber Pro" (timer restrictivo, retención local de marcadores de progreso, retroalimentación).
- Módulo estadístico administrativo: Cálculo automatizado en tiempo real de ratios de aprobación y métricas poblacionales. Listado de Estudiantes en peligro.
- Auditoría automática: Registro indeleble en tabla `login_logs` por cada intento de autenticación capturando Host IP y User-Agent.

**Requisitos no funcionales:**
- Responvisidad máxima: Componentes visuales UI modulares, adaptabilidad Dark Mode integral.
- Seguridad en red: Restricción pro-activa de ancho de banda (Payload Max Bounds) y limitador de peticiones (429 Rate Limit Handler).
- Tiempo de inactividad controlado: auto-logout de cuentas dormidas localmente por 5 minutos, con extinción asíncrona a nivel JWT (Expiración: 30 minutos).
- Desempeño: Interfaces re-renderizadas asíncronamente con promesas sin bloqueo UI.

**Requisitos técnicos (software/hardware):**
- **Servidor Backend:** Python 3.11/3.12 (Aviso Crítico: versión >=3.13 genera inestabilidades incompatibles detectadas con capas SQLAlchemy subyacentes).
- **Servidor Frontend:** Entorno en tiempo de ejecución Node.js v20+, package manager npm.
- **Base de Datos:** Motor transaccional PostgreSQL.

---

## 4. Instalación y configuración

**Pasos detallados para instalación:**
1. Clonación central. `git clone [REPO_URL]` y situarse en la raíz del entorno.
2. **Entorno Backend:**
   - Ubicarse en carpeta `/backend`.
   - Generación de entorno virtual de módulos aislados: `python -m venv venv`.
   - Activar el entorno: `.\venv\Scripts\activate` (Entornos MS Windows) / `source venv/bin/activate` (Entornos POSIX).
   - Instalar drivers y dependencias: `pip install -r requirements.txt`.
3. **Entorno Frontend:**
   - Ubicarse en carpeta `/frontend`.
   - Construcción local de la pila de paquetes node: `npm install`.

**Configuración del entorno y Variables (`.env`)**
Ambos marcos de ejecución requieren definición manual de variables puente (no incluidas en el control de revisiones).

*Backend (`backend/.env`):*
```env
DATABASE_URL=postgresql+psycopg://[USUARIO]:[CONTRASEÑA]@[HOST_AIVEN/SUPABASE]:5432/[DB]
SECRET_KEY=firma_sha_local
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

*Frontend (`frontend/.env.local`):*
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
*(Nota Técnica: La IP apunta al localhost para entornos dev pre-producción).*

---

## 5. Estructura del proyecto
**Explicación de carpetas y archivos clave:**
- **`/backend/app/api/routers`:** Define las APIs y endpoints del gateway dividiendo a nivel de archivos el contexto (ej. `auth.py`, `admin.py`).
- **`/backend/app/core/`:** Configuración de contexto vital como parsing `env` (`config.py`) y las funciones de criptografía asimétrica e intercambio de JWT (`security.py`).
- **`/backend/app/db/` y `/models/`:** Inicialización de puente bidireccional PostgreSQL `URL Engine` mediante psycopg y las descripciones de entidades relacionales SQLAlchemy.
- **`/frontend/src/app`:** Implementación Next.js Server-App. Agrupa sub-directorios por entidad final (admin, dashboard, profesor), dictando inherentemente sus resoluciones de URL (Routing).
- **`/frontend/src/components`:** Componentes desacoplados. Directorio `/ui/` centraliza la librería visual pura Shadcn (RadioGroups, ProgressBars, Modals). Y componentes top-level como `UserNav.tsx` y el estricto `ProtectedRoute.tsx`.
- **`/frontend/src/lib/api.ts`:** SDK local con 13 funciones dedicadas e interfaces inyectoras para abstraer a los componentes React del proceso real HTTP.

**Rol de cada módulo:**
- **Módulo Auth:** Gestiona login dual y protección JWT, así como validación de docentes mediante base de datos y pines efímeros.
- **Módulo Admin:** Control global responsable de entregar las estadísticas de usuarios, gráficas visuales macro y listas de estudiantes.
- **Módulo Dashboard:** Concentrado en la experiencia del alumno con el motor de cuestionario (Prueba Simulada).

---

## 6. Funcionamiento del sistema
**Flujo de ejecución principal:**
1. **Acceso Base:** Estudiante accesa a la raíz, de no haber Contexto Autorizado via Hook (`useAuth()`), Next redireccionará automáticamente a form modal local en `/auth/login`.
2. **Tokenización:** Envío de payload JSON/Multipart de inicio de sesión a endpoint `/auth/login`. Si las credenciales cifradas emparejan el DB Hash, devuelve Bearer JWT. Local Client perservará header de persistencia en toda request futura.
3. **Restricción de Enrutamiento (Guards):** El cliente decodifica su role "Estudiante" en Next Router. Si es Estudiante, las UI ocultarán features como reportes globales de Admin, pero permitirán despliegue hacia `/dashboard/prueba-simulada`.
4. **Ciclos Autónomos:** Toda interacción registra su estampa temporal, si el temporizador excede los umbrales estáticos inactivos se fuerza la purga de sesión del caché del cliente y se enruta de vuelta al inicio.

**Lógica extendida en Simulación Ponderada:**
Durante la prueba de nivel (Saber Pro), el alumno cuenta con 120 minutos. El progreso y selecciones de radio son bufferizadas per local-session, no en la Base de Datos para asegurar velocidad pura offline-friendly de selección de respuesta, sincronizando al emitir finalización para cálculo radar de áreas (Razonamiento, Matemáticas, Lectura, etc).

**Casos de uso relevantes:**
- Administrador ingresa para originar y entregar un código temporal docente `DOC-XXXXXX`.
- Estudiante que finaliza la Prueba Saber Pro simulada para observar el "Radar de Competencias" actualizado.
- Interacción con el "Tutor IA" solicitando asistencia especializada pre-examen.

---

## 7. Documentación del código
**Explicación de funciones y decisiones prominentes:**
- **`request_contract_middleware()` (backend/app/main.py):** Arquitectura inyectada base. Limita transacciones a través de colecciones Dictionary por IP (`RATE_LIMIT_BUCKETS`). Evalúa los header sizes de payload contra un límite `settings.MAX_REQUEST_SIZE_BYTES`, rechazando en tiempo constante 413 ataques buffer-overflow masivos. Provee sanitization forzando application/json en todas las rutas a excepción del login. Encargado principal preventivo y mitigador Web.
- **`build_error_response()` (backend/app/main.py):** Estandarización unificadora que impone a cada Excepción de FastAPI/Pydantic una máscara de parseabilidad idéntica: `{ "success": false, "message": "...", "error": { "code": "...", "details": [...] } }`, clave para un Frontend sin "sorpresas" parseando JSON errados.
- **`ProtectedRoute.tsx` (frontend/src/components/):** Sujeto a iteraciones, provee aislamiento frontal blindado validando que los scopes admitidos per página emparejen la enumeración extraída por el decodificador de estado de cuenta.

**Buenas prácticas aplicadas:**
- **Manejadores Globales (`@app.exception_handler`):** El backend envuelve incluso excepciones genéricas incontroladas (500) y de falla operativa SQL (503), regresando respuestas seguras que jamás envían "Stack Traces" o volcados de memoria crudos al Frontend. Esto protege infraestructura a nivel Ciberseguridad/PenTesting pasivo.
- **Transaccionalidad Atómica:** El consumo de "Códigos de Docente" a la hora de registrar cuentas es transaccional (consume flag o cancela previniendo race conditions).
- **Separación de responsabilidades Frontend/Backend:** Al desacoplar lógicas de visualización de los Workers backend con FastAPI en vez de usar arquitecturas arcaicas inyectadas de SSR desde Python, los endpoints operan únicamente como fábricas de intercambio JSON puras.

---

## 8. Uso del sistema
**Cómo ejecutar el proyecto:**
Servidores orquestados paralelamente (Entorno Dev):
- Backend: En terminal separada situarse en `backend/` e invocar a uvicorn `.\venv\Scripts\uvicorn app.main:app --reload`. Expone API documentada internamente en http://localhost:8000/docs (Swagger UI).
- Frontend: En terminal separada situarse en `frontend/` correr local dev server con `npm run dev`. Expone visualmente en http://localhost:3000.

**Ejemplos de Uso y Entradas/Salidas Esperadas:**
- **Onboarding Administrativo:** Se ingresa mediante credenciales de superusuario, navegando luego a "Configuración -> Accesos", procediendo a Generar un Código Temporal y copiando su salida visual de pantalla.
- **Rol Docente:** El usuario accede al Endpoint público `/auth/register?type=teacher` que despliega el formulario especial. La entrada requiere Nombre, Email, Password, y *Código Válido*. Retorna HTTP 201 en la red y transiciona al login.
- **Operatividad del Alumnado:** Registrándose desde cero y autenticando correctamente. Entradas inválidas en los endpoints HTTP devuelven código `422 (Unprocessable Entity)` gracias a Pydantic de Python que auto valida campos al vuelo, garantizando integridad referencial.

---

## 9. Mantenimiento y escalabilidad
**Cómo modificar o extender el sistema:**
- **Integrar Vistas Visuales:** Adicionar rutas dinámicas o estáticas dentro de Layouts de Roles ya creados asgurando importación de un respectivo `page.tsx` en `src/app/[module]/`.
- **Integrar Nuevos Endpoints (Data Sources):** Operar modularmente en capas:
  1. Elaborar esquema relacional base en `models/`.
  2. Implementar schema de transferencia de datos en `schemas/`.
  3. Componer el handler HTTP resolvente en `routers/` importando y acoplando dependencias enrutables.
  4. Atar el Sub-router a la aplicación principal incluyéndolo en `app.include_router()` en `app/main.py`.

**Posibles mejoras futuras:**
- **State Management vía Caché Exclusivo Redis:** Sustituir la mecánica in-memory actual de control de Rate Limit/Dictionary temporal en FastAPI por un pool Redis real, habilitando la supervivencia del guardián de accesos si se eleva FastAPI a orquestación de multi-workers con balanceo.
- **Hardening de Sesión Cookie-based:** Migrar pasivamente el flujo actual frontend de JWT suplementado localmente por Tokens de Cookies con restricción Strict SameSite/HTTPOnly para erradicar cualquier vector de robo XSS inyectivo.

**Riesgos técnicos:**
- **Volatilidad de Historial por Persistencia Local:** La funcionalidad completa en la sección "Dashboard de Progreso Simulacro" actual persiste de cara al cliente mediante Web Storage API (LocalStorage). Cambiar de dispositivo (o limpiar caché HTTP del navegador) resetea las estadísticas analíticas previas hasta que sean interceptadas globalmente y conectadas de forma estricta hacia el entorno del PostgreSQL (requiere backend refactor de un path `/sync/`).
- **Conflictos Estructurales con Python >3.12:** Debido a advertencias de deprecio inminentes en entornos Python 3.13 en correlación con dependencias asíncronas SQLAlchemy. Operar a futuro requerirá audítoria de librerías subyacentes con `pip-audit`.
