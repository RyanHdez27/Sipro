# Unión de Todas las Tablas de la DB al Proyecto

## ¿Qué significa "unir las tablas"?

El proyecto tiene una base de datos en Supabase con **16 tablas** creadas. Sin embargo, el backend de Python (FastAPI) solo conocía **1 tabla**: `users`. Las otras 15 tablas existían en Supabase pero **ningún archivo del backend las tocaba** — estaban desconectadas del código.

"Unir las tablas" significa crear 3 cosas por cada tabla:

1. **Modelo** (SQLAlchemy) → le dice a Python "esta tabla existe y tiene estas columnas"
2. **Schema** (Pydantic) → define qué datos entran y salen de cada endpoint
3. **Ruta API** (FastAPI Router) → los endpoints HTTP que el frontend puede llamar

Sin estos 3 elementos, una tabla en Supabase es invisible para el backend.

---

## Tipo de base de datos — Híbrida

Supabase usa **PostgreSQL**, que es relacional, pero este proyecto la usa de forma **híbrida** porque combina 3 tipos de almacenamiento:

### Parte relacional (SQL clásico)
Las tablas tienen **foreign keys** entre sí (`student_id` → `students`, `competency_id` → `competencies`, etc.). Las relaciones son 1:N normales y los tipos son los clásicos: `UUID`, `INTEGER`, `TEXT`, `BOOLEAN`, `TIMESTAMP`, `NUMERIC`.

### Parte documento/NoSQL (JSONB)
Varias columnas guardan datos semiestructurados en formato **JSONB** — esto es comportamiento tipo NoSQL dentro de PostgreSQL:

| Tabla | Columna JSONB | Qué guarda |
|-------|---------------|------------|
| `assessments` | `config` | Configuración variable del simulacro |
| `questions` | `options` | Opciones de respuesta `[{A: "..."}, {B: "..."}]` |
| `questions` | `answer_key` | Clave correcta (puede ser compleja) |
| `results` | `report_json` | Reporte completo de calificación |
| `chat_messages` | `metadata` | Metadatos variables del mensaje |
| `chat_sessions` | `context` | Contexto variable de la sesión |
| `competency_results` | `recommendations` | Recomendaciones generadas por IA |
| `content_chunks` | `metadata` | Metadatos del chunk |

### Parte vectorial (IA/búsqueda semántica)
La columna `embedding` en `content_chunks` usa **pgvector** — una extensión de PostgreSQL para guardar vectores numéricos de 1024 dimensiones y hacer búsqueda por similitud coseno. Esto es lo que hace funcionar el RAG (Retrieval-Augmented Generation) del sistema.

### Resumen del tipo de base de datos

| Tipo | Qué hace | Ejemplo |
|------|----------|---------|
| **Relacional** | Foreign keys, JOINs, normalización | `students` → `assessments` → `results` |
| **Documento (JSONB)** | Datos flexibles sin esquema fijo | `config`, `options`, `report_json` |
| **Vectorial (pgvector)** | Búsqueda semántica para RAG | `embedding` en `content_chunks` |

PostgreSQL permite todo esto en una sola base de datos — por eso se considera **híbrida**.

---

## Antes vs Después

| Antes | Después |
|-------|---------|
| 1 modelo (`users`) | 16 modelos (todas las tablas) |
| 2 schemas (`user.py`, `token.py`) | 8 schemas |
| 2 routers (`auth.py`, `users.py`) | 9 routers |
| 5 endpoints | **30 endpoints** |
| Solo login/registro funcionaba | Simulacros, calificación, chat, reportes |

---

## Estructura de archivos creados

```
backend/app/
├── models/                    ← Modelos SQLAlchemy (1 tabla = 1 clase)
│   ├── user.py                   [MODIFICADO] + columna role
│   ├── student.py                [NUEVO] tabla students
│   ├── question.py               [NUEVO] tablas questions, competencies, topics
│   ├── assessment.py             [NUEVO] tablas assessments, assessment_items, responses, results, competency_results
│   ├── pedagogy.py               [NUEVO] tabla student_mastery
│   ├── chat.py                   [NUEVO] tablas chat_sessions, chat_messages, message_citations
│   └── content.py                [NUEVO] tablas content_sources, content_chunks
│
├── schemas/                   ← Schemas Pydantic (formato de datos de entrada/salida)
│   ├── user.py                   [MODIFICADO] + campo role
│   ├── student.py                [NUEVO]
│   ├── question.py               [NUEVO]
│   ├── assessment.py             [NUEVO]
│   ├── pedagogy.py               [NUEVO]
│   ├── chat.py                   [NUEVO]
│   └── content.py                [NUEVO]
│
├── api/routers/               ← Rutas API (endpoints HTTP)
│   ├── auth.py                   [MODIFICADO] + campo role en registro
│   ├── users.py                  [MODIFICADO] + campo role en actualización
│   ├── students.py               [NUEVO] S2 — Student Service
│   ├── questions.py              [NUEVO] S3 — Questions Service
│   ├── evaluation.py             [NUEVO] S4 — Evaluation Service
│   ├── pedagogy.py               [NUEVO] S5 — Pedagogy Service
│   ├── tutor.py                  [NUEVO] S6 — Tutor IA Service
│   ├── embeddings.py             [NUEVO] S7 — Embeddings Service
│   └── reporting.py              [NUEVO] S8 — Reporting Service
│
└── main.py                    [MODIFICADO] registra los 9 routers
```

---

## Explicación de cada componente

### 1. Modelo User (modificado)

**Archivo:** `models/user.py`
**Tabla:** `users`

Se agregó la columna `role` con 3 valores posibles:
- `estudiante` — el usuario por defecto, presenta simulacros
- `docente` — puede ver reportes grupales
- `administrador` — puede crear preguntas y gestionar el sistema

La tabla `users` maneja **autenticación** (login, JWT, contraseña). No guarda datos académicos.

---

### 2. Student Service — S2

**Archivo:** `routers/students.py`
**Tablas que usa:** `students`, `student_mastery`, `assessments`, `results`

El Student Service gestiona el **perfil académico** del estudiante: su programa, semestre, nivel y progreso por competencia.

La tabla `students` está **separada** de `users` a propósito:
- `users` = quién eres para el sistema (email + contraseña + rol)
- `students` = quién eres académicamente (programa, semestre, nivel)
- Se vinculan por el campo `email`

**Endpoints creados:**

| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/students/{id}` | Devuelve el perfil completo del estudiante |
| PUT | `/students/{id}` | Actualiza programa, semestre, nivel |
| GET | `/students/{id}/progress` | Muestra el puntaje de dominio por competencia (tabla `student_mastery`) |
| GET | `/students/{id}/history` | Lista todos los simulacros hechos con sus puntajes |

---

### 3. Questions Service — S3

**Archivo:** `routers/questions.py`
**Tablas que usa:** `questions`, `competencies`, `topics`

Es la **biblioteca de preguntas** del sistema. Guarda todas las preguntas tipo ICFES con su enunciado, opciones, clave correcta, explicación y dificultad.

- `competencies` = las competencias del ICFES (Lectura Crítica, Razonamiento Cuantitativo, etc.)
- `topics` = temas dentro de cada competencia (se pueden anidar con parent_id)
- `questions` = las preguntas del banco, cada una vinculada a 1 competencia y 1 tema

**Endpoints creados:**

| Método | Ruta | Qué hace |
|--------|------|----------|
| GET | `/questions/categories` | Lista todas las competencias disponibles |
| POST | `/questions/exam` | Genera un simulacro con N preguntas aleatorias filtradas por competencia y dificultad |
| GET | `/questions/{id}` | Devuelve una pregunta **sin** la respuesta correcta (para el estudiante) |
| GET | `/questions/{id}/answer` | Devuelve la respuesta correcta (solo para calificación interna) |
| POST | `/questions/` | Crea una nueva pregunta en el banco (para administradores) |

---

### 4. Evaluation Service — S4 (Agente 1)

**Archivo:** `routers/evaluation.py`
**Tablas que usa:** `assessments`, `assessment_items`, `questions`, `responses`, `results`

Este es el **corazón del flujo de calificación**. Implementa el **Agente 1** — lógica determinista en Python puro (sin IA). Cuando el estudiante termina un simulacro:

1. Recibe las respuestas del estudiante
2. Busca las claves correctas de cada pregunta
3. Compara una por una
4. Calcula el puntaje total y el porcentaje
5. Guarda cada respuesta en `responses` y el resultado global en `results`
6. Marca el assessment como "graded"

**Endpoints creados:**

| Método | Ruta | Qué hace |
|--------|------|----------|
| POST | `/evaluation/submit` | Recibe respuestas, califica automáticamente y guarda resultado |
| GET | `/evaluation/{id}/report` | Devuelve el reporte completo con puntajes |
| GET | `/evaluation/{id}/status` | Indica si el simulacro está en progreso, enviado o calificado |

---

### 5. Pedagogy Service — S5 (Agente 2 — Stub)

**Archivo:** `routers/pedagogy.py`
**Tablas que usa:** `student_mastery`, `competency_results`, `results`

Aquí vivirá el **Agente 2** — el pedagogo con IA que analiza los errores y genera retroalimentación personalizada usando RAG (material ICFES). Por ahora los endpoints están como **stubs** (funcionan pero devuelven un mensaje de "pendiente de integración") porque requieren LangChain + LangGraph + OpenAI API.

**Endpoints creados:**

| Método | Ruta | Qué hace | Estado |
|--------|------|----------|--------|
| POST | `/pedagogy/analyze` | Ejecutará el Agente 2 con el reporte | 🔸 Stub |
| GET | `/pedagogy/{student_id}/profile` | Devuelve el dominio por competencia | ✅ Funcional |
| GET | `/pedagogy/{student_id}/feedback` | Última retroalimentación generada | 🔸 Stub |
| POST | `/pedagogy/recovery-test` | Generará test de recuperación | 🔸 Stub |

---

### 6. Tutor IA Service — S6 (Agente 3 — Stub)

**Archivo:** `routers/tutor.py`
**Tablas que usa:** `chat_sessions`, `chat_messages`

Gestiona las **sesiones de tutoría** (chat). Aquí vivirá el **Agente 3** — el tutor conversacional que habla con el estudiante en tiempo real via WebSocket. Por ahora tiene la gestión básica de sesiones; el WebSocket con IA se implementará cuando se integre LangGraph.

**Endpoints creados:**

| Método | Ruta | Qué hace | Estado |
|--------|------|----------|--------|
| POST | `/tutor/session/start` | Crea una nueva sesión de chat | ✅ Funcional |
| GET | `/tutor/session/{id}` | Datos de la sesión activa | ✅ Funcional |
| GET | `/tutor/session/{id}/messages` | Historial de mensajes | ✅ Funcional |
| DELETE | `/tutor/session/{id}` | Cierra la sesión | ✅ Funcional |
| WS | `/tutor/chat/{id}` | Chat en tiempo real | 🔸 Pendiente (WebSocket) |

---

### 7. Embeddings Service — S7 (Stub)

**Archivo:** `routers/embeddings.py`
**Tablas que usa:** `content_sources`, `content_chunks`

Es el **motor de búsqueda inteligente** del sistema. Convertirá material académico en vectores (embeddings) usando HuggingFace y los guardará en pgvector para búsqueda semántica. Los Agentes 2 y 3 lo usarán para encontrar material relevante (RAG).

**Endpoints creados:**

| Método | Ruta | Qué hace | Estado |
|--------|------|----------|--------|
| POST | `/embeddings/index` | Indexará documentos en pgvector | 🔸 Stub |
| POST | `/embeddings/search` | Búsqueda semántica + Cohere reranking | 🔸 Stub |
| GET | `/embeddings/status` | Cuenta documentos y chunks indexados | ✅ Funcional |

---

### 8. Reporting Service — S8

**Archivo:** `routers/reporting.py`
**Tablas que usa:** `results`, `assessments`, `students`

Genera **reportes** de desempeño. El reporte individual lista todos los simulacros con puntajes. El grupal muestra promedios para que los docentes vean el rendimiento de todos los estudiantes. La exportación a PDF se implementará con WeasyPrint.

**Endpoints creados:**

| Método | Ruta | Qué hace | Estado |
|--------|------|----------|--------|
| GET | `/reports/student/{id}` | Lista todos los reportes de un estudiante | ✅ Funcional |
| POST | `/reports/export` | Generará PDF del reporte | 🔸 Stub |
| GET | `/reports/group` | Promedio grupal (para docentes) | ✅ Funcional |
| GET | `/reports/analytics` | Métricas generales de la plataforma | ✅ Funcional |

---

## Relación entre tablas (quién usa qué)

```
users ──────── Autenticación (login/JWT/roles)
    │ email
students ──── Perfil académico
    │
    ├──► assessments ──► assessment_items ──► responses
    │         │
    │         └──► results ──► competency_results
    │
    ├──► student_mastery (progreso por competencia)
    │
    └──► chat_sessions ──► chat_messages ──► message_citations
                                                    │
questions ◄── competencies                          │
    │         topics                                │
    │                                               │
content_sources ──► content_chunks ◄────────────────┘
                    (embeddings/RAG)
```

---

## Cómo probarlo

```bash
cd backend
venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000
```

Abrir en el navegador: **http://localhost:8000/docs**

Ahí aparecen los 30 endpoints organizados por categoría (auth, users, students, questions, evaluation, pedagogy, tutor, embeddings, reports). Se pueden probar directamente desde la interfaz Swagger.

---

## ¿Qué falta por implementar?

Los endpoints marcados como 🔸 Stub necesitan:

| Tarea pendiente | Qué se necesita |
|-----------------|-----------------|
| Agente 2 (Pedagogy) | LangChain + LangGraph + OpenAI API key |
| Agente 3 (Tutor chat) | WebSocket + LangGraph |
| Embeddings/RAG | HuggingFace embeddings + Cohere reranking + pgvector extension |
| Exportación PDF | WeasyPrint |
| Envío por correo | SMTP institucional |

---

## ¿Qué es pgvector y por qué se usa en este proyecto?

### Qué es

**pgvector** es una extensión de PostgreSQL que agrega un tipo de dato llamado `vector` y funciones de búsqueda por similitud. Un vector es una lista de números (ej: 1024 números decimales) que representa el "significado" de un texto.

### Cómo funciona (simplificado)

```
Texto: "¿Cuál es la derivada de x²?"
        ↓ (HuggingFace lo convierte)
Vector: [0.23, -0.15, 0.87, ..., 0.41]  ← 1024 números
        ↓ (se guarda en PostgreSQL)
content_chunks.embedding = vector(1024)
```

Después, cuando el estudiante pregunta algo en el chat:

```
Pregunta: "No entiendo derivadas"
        ↓ (se convierte a vector)
        ↓ (se busca el vector más parecido en la DB)
        ↓ (búsqueda por similitud coseno)
Resultado: los 3 fragmentos de material ICFES más relevantes
```

### Por qué se usa en ESTE proyecto

El proyecto tiene un sistema **RAG** (Retrieval-Augmented Generation) que funciona en 3 pasos:

1. **Indexación** (una sola vez): Se sube material académico del ICFES → HuggingFace lo convierte en vectores → se guardan en `content_chunks.embedding` usando pgvector

2. **Búsqueda** (en tiempo real): Cuando el Agente 2 necesita explicar un error, o el Agente 3 necesita responder una pregunta, buscan en pgvector los fragmentos de material ICFES más relevantes al tema

3. **Generación**: El LLM (ChatGPT) recibe esos fragmentos como contexto y genera una respuesta basada en material real del ICFES — no inventa

**Sin pgvector**, los agentes 2 y 3 responderían con conocimiento genérico del LLM, sin estar anclados al material oficial del ICFES. Las respuestas serían menos precisas y potencialmente incorrectas para el contexto colombiano.

---

## Cambios pendientes en Supabase (SQL)

Al comparar la estructura actual de la base de datos (documentada en `union.md`) con lo que la arquitectura necesita, se identificaron **2 cambios necesarios** y **2 que NO se deben hacer**.

### ✅ Cambio 1 — Activar pgvector

La columna `embedding` en `content_chunks` aparece como `USER-DEFINED` en vez de `vector(1024)`. Sin pgvector activo, el RAG no funciona.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### ✅ Cambio 2 — Completar la tabla chat_sessions

La tabla `chat_sessions` actualmente tiene: `id`, `student_id`, `context`, `summary`, `created_at`, `closed_at`. Pero la arquitectura del Agente 3 (LangGraph) necesita 4 columnas adicionales:

| Columna faltante | Para qué la necesita el Agente 3 |
|------------------|----------------------------------|
| `assessment_id` | Vincular la sesión de chat con el simulacro que la originó — sin esto el tutor no sabe de qué errores hablar |
| `langgraph_thread_id` | LangGraph guarda checkpoints con este ID — sin él, el estudiante pierde toda la conversación cada vez que cierra el chat |
| `agent_state_snapshot` | Guarda el estado completo del agente (en qué paso del flujo va, qué ya analizó) — sin esto no puede retomar donde quedó |
| `status` | Saber si la sesión está `active`, `closed` o `expired` — sin esto no hay forma de filtrar sesiones activas |

```sql
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS assessment_id UUID REFERENCES assessments(id),
ADD COLUMN IF NOT EXISTS langgraph_thread_id TEXT,
ADD COLUMN IF NOT EXISTS agent_state_snapshot JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
```

### ❌ Cambio rechazado — password_hash en students

El documento `claude2.md` sugería agregar `password_hash` a la tabla `students`. **Esto NO se debe hacer** porque la autenticación (contraseña + JWT + roles) ya se maneja en la tabla `users`. Agregar la contraseña a `students` duplicaría el dato en dos tablas — un error de diseño.

### ❌ Cambio rechazado — Eliminar tabla users

También se sugería eliminar la tabla `users`. **Esto NO se debe hacer** porque `users` es la base del sistema de autenticación con los 3 roles (estudiante, docente, administrador). Si se borra, se cae todo el login.

---

## ¿Dónde ejecutar los cambios SQL?

Estos cambios **NO se pueden hacer desde el backend** por temas de permisos. Se deben ejecutar desde Supabase:

| Cambio | ¿Desde el backend? | ¿Dónde hacerlo? |
|--------|-------------------|-----------------|
| `CREATE EXTENSION vector` | ❌ No — requiere superusuario | **Dashboard Supabase → Database → Extensions → buscar "vector" → Enable** |
| `ALTER TABLE chat_sessions` | ⚠️ Técnicamente sí, pero no recomendado | **Dashboard Supabase → SQL Editor → pegar el SQL → Run** |

**Pasos en Supabase:**

1. Ir a [app.supabase.com](https://supabase.com) → abrir el proyecto
2. Para pgvector: ir a **Database → Extensions** → buscar `vector` → click **Enable**
3. Para chat_sessions: ir a **SQL Editor** → pegar el ALTER TABLE → click **Run**
