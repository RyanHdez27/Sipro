|

**DOCUMENTO DE ARQUITECTURA TÉCNICA**

_Versión 1.0 — Para Desarrollo e Implementación_

**TUTOR VIRTUAL UNIVERSITARIO**

**Sistema Multiagente con IA para la Preparación**

**de Pruebas de Estado en Colombia**

Arquitectura de Microservicios · Python / FastAPI · LangGraph

PostgreSQL · Docker · Next.js

| **Audiencia**<br><br>Equipo de desarrollo y Comité Académico | **Propósito**<br><br>Guía de implementación para producción |
| --- | --- |

**01 Resumen Ejecutivo**

El presente documento describe la arquitectura técnica definitiva del Tutor Virtual Universitario (TVU), una plataforma de preparación para pruebas de estado colombianas basada en un sistema de microservicios orquestados por tres agentes de Inteligencia Artificial especializados. Este documento tiene como propósito servir como guía normativa de implementación para el equipo de desarrollo y como referencia de evaluación para el comité académico.

El sistema está diseñado sobre una arquitectura de microservicios en Python con FastAPI, orquestación multiagente mediante LangGraph y LangChain, almacenamiento en PostgreSQL, interfaz en Next.js y despliegue contenerizado con Docker en infraestructura cloud. Esta combinación tecnológica garantiza modularidad, escalabilidad horizontal, mantenibilidad a largo plazo y alineación con el estado del arte en sistemas de IA agéntica para el año 2025.

| **Componente** | **Tecnología Seleccionada** | **Justificación** |
| --- | --- | --- |
| Backend API | Python 3.12 + FastAPI | Alto rendimiento async, validación Pydantic, OpenAPI nativo |
| --- | --- | --- |
| Orquestación IA | LangGraph + LangChain | Control de estado de grafos, memoria, herramientas y RAG |
| --- | --- | --- |
| Base de datos | PostgreSQL 16 + pgvector | Transaccional, soporte vectorial nativo, madurez probada |
| --- | --- | --- |
| Frontend | Next.js 14 (App Router) | SSR, SEO, WebSockets, ecosistema React maduro |
| --- | --- | --- |
| Contenedores | Docker + Docker Compose | Reproducibilidad, aislamiento, portabilidad al cloud |
| --- | --- | --- |
| LLM Principal | OpenAI GPT-4o / Claude 3.5 | Calidad de razonamiento pedagógico y generación de texto |
| --- | --- | --- |
| Despliegue | Servidor cloud (VPS/ECS) | Control total de infraestructura, costos predecibles |
| --- | --- | --- |

**02 Problema que Aborda el Proyecto**

## **2.1 Contexto Educativo Colombiano**

Las Pruebas de Estado administradas por el ICFES —Saber 11 para acceso a educación superior y Saber Pro para certificación universitaria— constituyen hitos determinantes en la trayectoria académica de los estudiantes colombianos. Sin embargo, los datos de desempeño revelan brechas estructurales: según reportes del ICFES, más del 40% de los estudiantes que presentan Saber 11 no alcanzan niveles satisfactorios en matemáticas y lectura crítica. Esta situación limita el acceso a programas universitarios de alta demanda y perpetúa ciclos de desigualdad educativa, especialmente en zonas rurales y en estudiantes de instituciones públicas con menor infraestructura de apoyo.

## **2.2 Dificultades Actuales de Preparación**

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Barreras identificadas en la preparación tradicional</strong></p><ul><li>Ausencia de retroalimentación personalizada: los simulacros devuelven un puntaje pero no explican el origen cognitivo del error</li><li>Falta de diagnóstico por competencia: el estudiante no sabe en qué componente específico de cada área es débil</li><li>Acceso inequitativo: la preparación de calidad depende de recursos económicos para academias y tutores privados</li><li>Estudio sin adaptación: todos los estudiantes reciben el mismo material sin considerar sus fortalezas y debilidades individuales</li><li>Discontinuidad en el seguimiento: sin un sistema que rastree el progreso, es difícil medir la mejora real entre sesiones</li><li>Limitación de tiempo docente: los profesores no pueden personalizar el proceso para grupos de 30+ estudiantes simultáneamente</li></ul></th></tr></thead></table></div>

## **2.3 Limitaciones de los Métodos Tradicionales**

Los métodos tradicionales de preparación —clases magistrales, libros de ejercicios, simulacros impresos— presentan limitaciones estructurales que impiden una preparación efectiva a escala. Los simulacros digitales disponibles en el mercado colombiano generalmente ofrecen únicamente corrección automática de respuestas sin análisis pedagógico profundo, sin identificación de patrones de error y sin generación adaptativa de nuevo contenido de práctica. Esto convierte la preparación en un proceso mecánico de repetición sin aprendizaje reflexivo.

## **2.4 Cómo la IA Transforma el Aprendizaje**

Un sistema de tutoría inteligente basado en agentes de IA supera estas limitaciones mediante tres capacidades que los métodos tradicionales no pueden ofrecer a escala: (1) diagnóstico preciso por competencia con identificación de patrones de error, (2) retroalimentación personalizada generada en lenguaje natural adaptada al historial específico del estudiante, y (3) generación dinámica de contenido de práctica focalizado en las áreas de mayor debilidad. La combinación de estas capacidades crea un ciclo de mejora continua e iterativa que adapta el proceso de preparación a cada estudiante de forma individual.

**03 Objetivos del Sistema**

## **3.1 Objetivos Pedagógicos**

- Proporcionar retroalimentación personalizada e inmediata sobre errores cometidos en pruebas simuladas, explicando el razonamiento correcto en lenguaje claro
- Detectar automáticamente las competencias y componentes temáticos con mayor debilidad por estudiante mediante análisis estadístico del historial de respuestas
- Generar tests de recuperación focalizados que refuercen específicamente las áreas identificadas como débiles, con dificultad progresiva
- Permitir la profundización temática libre mediante un agente conversacional que responda preguntas conceptuales en lenguaje natural
- Hacer visible y medible el progreso del estudiante a través del tiempo mediante métricas de desempeño por competencia

## **3.2 Objetivos Tecnológicos**

- Implementar una arquitectura de microservicios escalable horizontalmente que soporte crecimiento de base de usuarios sin rediseño estructural
- Construir un sistema multiagente con LangGraph que gestione el flujo pedagógico de forma confiable, con manejo de errores y recuperación de estado
- Implementar un sistema RAG con pgvector que enriquezca la retroalimentación con material pedagógico curado del ICFES
- Garantizar tiempos de respuesta inferiores a 5 segundos para interacciones conversacionales y 2 segundos para evaluación de pruebas
- Asegurar disponibilidad del 99.5% mediante despliegue contenerizado con monitoreo y recuperación automática

## **3.3 Impacto Esperado**

| **Dimensión** | **Indicador de Éxito** |
| --- | --- |
| Acceso | Disponibilidad 24/7 sin costo de tutoría privada para cualquier estudiante con conexión |
| --- | --- |
| Personalización | Perfil de competencias individualizado actualizado tras cada prueba realizada |
| --- | --- |
| Calidad | Retroalimentación validada pedagógicamente que supera la explicación mecánica de respuestas |
| --- | --- |
| Desempeño | Mejora medible en percentil ICFES tras uso sostenido del sistema por 4+ semanas |
| --- | --- |
| Escala | Soporte para 1.000+ usuarios concurrentes sin degradación de rendimiento |
| --- | --- |

**04 Arquitectura General del Sistema**

El sistema adopta una arquitectura de microservicios con orquestación multiagente. Cada componente funcional se despliega como un servicio independiente con su propia responsabilidad, API y ciclo de vida. Los agentes de IA operan sobre esta base de servicios, coordinados por LangGraph como motor de orquestación de estado.

**\[ DIAGRAMA DE ARQUITECTURA GENERAL \]**

┌─────────────────────────────────────────────────────────────────────────┐

│ CAPA CLIENTE │

│ ┌──────────────────────────────────────────────────────────────────┐ │

│ │ Next.js 14 — App Router — SSR + Client Components │ │

│ │ \[Prueba Simulada\] \[Chat Tutor\] \[Dashboard\] \[Resultados\] │ │

│ └──────────────────┬───────────────────────────────────────────────┘ │

└─────────────────────────────────────────────────────────────────────────┘

│ HTTPS / WebSocket

┌─────────────────────────────────────────────────────────────────────────┐

│ API GATEWAY / NGINX REVERSE PROXY │

│ Enrutamiento · Rate Limiting · TLS Termination │

└──────┬──────────┬──────────┬──────────┬──────────┬──────────┬───────────┘

│ │ │ │ │ │

┌──────▼──┐ ┌────▼────┐ ┌──▼──────┐ ┌▼────────┐ ┌▼───────┐ ┌▼──────────┐

│ Auth │ │Student │ │Questions│ │ Eval │ │Pedagogy│ │ Tutor IA │

│ Service │ │ Service │ │ Service │ │ Service │ │Service │ │ Service │

│ :8001 │ │ :8002 │ │ :8003 │ │ :8004 │ │ :8005 │ │ :8006 │

└─────────┘ └─────────┘ └─────────┘ └────┬────┘ └───┬────┘ └─────┬─────┘

│ │ │

┌────────────▼──────────▼────────────▼──────┐

│ LANGGRAPH ORCHESTRATOR │

│ \[Agente1\] ──► \[Agente2\] ──► \[Agente3\] │

│ AgentState · Checkpoints │

└───────────────────┬────────────────────────┘

│

┌───────────────────────────────────▼───────────────────────┐

│ CAPA DE DATOS │

│ \[PostgreSQL :5432\] \[pgvector index\] \[Redis :6379\] │

└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐

│ SERVICIOS EXTERNOS │

│ \[OpenAI API\] \[Anthropic API\] \[SMTP/Email\] │

└───────────────────────────────────────────────────────────┘

## **4.1 Principios Arquitectónicos**

- Responsabilidad única por servicio: cada microservicio gestiona una sola capacidad funcional
- Comunicación por contrato: interfaces REST definidas con OpenAPI/Pydantic sin acoplamiento implícito
- Estado externo: los servicios son stateless; el estado se persiste en PostgreSQL y Redis
- Fallos aislados: un servicio caído no propaga fallos al resto del sistema
- Despliegue independiente: cada servicio tiene su Dockerfile y puede actualizarse sin afectar los demás

**05 Diseño de Microservicios**

El sistema se compone de ocho microservicios independientes, cada uno implementado en Python con FastAPI. La comunicación entre servicios se realiza mediante llamadas HTTP REST síncronas para operaciones transaccionales y mediante eventos asincrónicos con Redis Pub/Sub para notificaciones y actualizaciones de estado no críticas.

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 1 — Auth Service [:8001]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Autenticación JWT</li><li>Registro y login</li><li>Gestión de roles (estudiante, admin)</li><li>Refresh tokens</li><li>OAuth2 futuro</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>POST /auth/register</li><li>POST /auth/login</li><li>POST /auth/refresh</li><li>POST /auth/logout</li><li>GET /auth/me</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Student Service (crear perfil)</li><li>Todos los servicios (validar token)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>python-jose</li><li>bcrypt</li><li>PostgreSQL</li><li>Pydantic</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 2 — Student Service [:8002]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Perfil académico del estudiante</li><li>Historial de pruebas</li><li>Preferencias y configuración</li><li>Estadísticas de progreso</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>GET /students/{id}</li><li>PUT /students/{id}</li><li>GET /students/{id}/progress</li><li>GET /students/{id}/history</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Auth Service (validación)</li><li>Eval Service (resultados)</li><li>Pedagogy Service (perfil pedagógico)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>SQLAlchemy</li><li>PostgreSQL</li><li>Pydantic</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 3 — Questions Service [:8003]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Banco de preguntas ICFES</li><li>Categorización por área y competencia</li><li>Generación de pruebas aleatorias</li><li>CRUD de preguntas (admin)</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>GET /questions/exam</li><li>GET /questions/{id}</li><li>POST /questions (admin)</li><li>GET /questions/categories</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Eval Service (pruebas)</li><li>Pedagogy Service (tests de recuperación)</li><li>Embeddings Service (indexación)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>PostgreSQL</li><li>SQLAlchemy</li><li>Pydantic</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 4 — Evaluation Service [:8004]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Recibe y valida respuestas del estudiante</li><li>Calcula puntajes por área y competencia</li><li>Genera reporte estructurado</li><li>Dispara al Agente 1 de LangGraph</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>POST /evaluation/submit</li><li>GET /evaluation/{id}/report</li><li>GET /evaluation/{id}/status</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Questions Service (clave de respuestas)</li><li>Tutor IA Service (dispara orquestador)</li><li>Student Service (guarda resultado)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>LangGraph (trigger)</li><li>PostgreSQL</li><li>asyncio</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 5 — Pedagogy Service [:8005]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Análisis de competencias débiles</li><li>Generación de tests de recuperación</li><li>Perfil pedagógico del estudiante</li><li>Ejecuta Agente 2 de LangGraph</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>POST /pedagogy/analyze</li><li>GET /pedagogy/{student_id}/profile</li><li>POST /pedagogy/recovery-test</li><li>GET /pedagogy/{student_id}/feedback</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Questions Service (genera test)</li><li>Embeddings Service (RAG)</li><li>Student Service (guarda perfil)</li><li>Tutor IA Service</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>LangGraph</li><li>LangChain</li><li>pgvector</li><li>OpenAI API</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 6 — Tutor IA Service [:8006]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Chat conversacional con el estudiante</li><li>Ejecuta Agente 3 de LangGraph</li><li>Gestiona sesiones de tutoría</li><li>Streaming de respuestas LLM</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>POST /tutor/chat</li><li>GET /tutor/session/{id}</li><li>POST /tutor/session/start</li><li>DELETE /tutor/session/{id}</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>LangGraph Orchestrator (estado)</li><li>Pedagogy Service (contexto)</li><li>Questions Service (nueva prueba)</li><li>Embeddings Service (RAG)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>LangGraph</li><li>LangChain</li><li>OpenAI API</li><li>WebSockets</li><li>Redis</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 7 — Embeddings / RAG Service [:8007]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Generación de embeddings de preguntas y material</li><li>Indexación en pgvector</li><li>Búsqueda semántica para RAG</li><li>Actualización del índice vectorial</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>POST /embeddings/index</li><li>POST /embeddings/search</li><li>POST /embeddings/reindex</li><li>GET /embeddings/status</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Questions Service (material a indexar)</li><li>Pedagogy Service (búsqueda RAG)</li><li>Tutor IA Service (búsqueda RAG)</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>LangChain</li><li>pgvector</li><li>OpenAI Embeddings</li><li>sentence-transformers</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Servicio 8 — Reporting Service [:8008]</strong></p></th></tr><tr><th><p></p><table><thead><tr><th><p><strong>Responsabilidades</strong></p><ul><li>Generación de reportes individuales y grupales</li><li>Exportación PDF/CSV</li><li>Métricas de uso de la plataforma</li><li>Dashboard institucional</li></ul></th><th><p><strong>Endpoints</strong></p><ul><li>GET /reports/student/{id}</li><li>GET /reports/group</li><li>POST /reports/export</li><li>GET /reports/analytics</li></ul></th><th><p><strong>Comunica con</strong></p><ul><li>Student Service</li><li>Evaluation Service</li><li>Pedagogy Service</li></ul></th><th><p><strong>Tecnologías</strong></p><ul><li>FastAPI</li><li>WeasyPrint (PDF)</li><li>pandas</li><li>PostgreSQL</li></ul></th></tr></thead></table><p></p></th></tr></thead></table></div>

**06 Arquitectura del Sistema Multiagente**

## **6.1 Orquestación con LangGraph y langchaing**

LangGraph implementa el flujo multiagente como un grafo de estado dirigido (StateGraph), donde cada nodo es un agente o función de transformación, y las aristas representan transiciones condicionales basadas en el estado actual. Esta representación garantiza que el flujo pedagógico sea determinista, inspeccionable y recuperable ante fallos.

**\[ GRAFO DE ESTADO LANGGRAPH — FLUJO DE LOS TRES AGENTES \]**

┌─────────────────────┐

│ START NODE │

│ (student submits │

│ exam answers) │

└──────────┬───────────┘

│

┌──────────▼───────────┐

│ AGENTE 1 │

│ EvaluatorNode │

│ · Valida respuestas │

│ · Calcula puntajes │

│ · Genera reporte │

└──────────┬───────────┘

│ state.evaluation_report

┌──────────▼───────────┐

│ AGENTE 2 │

│ PedagogyNode │

│ · Detecta debilid. │

│ · RAG feedback │

│ · Genera test recup.│

└──────────┬───────────┘

│ state.pedagogical_analysis

┌──────────────────▼──────────────────────┐

│ AGENTE 3 │

│ TutorNode │

│ · Responde preguntas (chat) │

│ · Aplica test de recuperación │

│ · Genera nueva prueba simulada │

└─────┬───────────────────────┬───────────┘

│ confirmed new exam │ continue chat

┌─────────▼─────────┐ ┌─────────▼─────────┐

│ NEW_EXAM node │ │ CHAT_LOOP node │

│ Genera prueba │ │ Continúa sesión │

│ → vuelve START │ │ conversacional │

└───────────────────┘ └───────────────────┘

## **6.2 Estructura del AgentState**

El estado compartido entre agentes se define como un TypedDict tipado que fluye inmutablemente entre nodos del grafo. Cada agente recibe el estado completo, realiza su procesamiento y retorna el estado actualizado con sus outputs. Esta inmutabilidad garantiza trazabilidad completa del flujo.

\# langgraph/state.py

from typing import TypedDict, Optional, List, Annotated

from langgraph.graph.message import add_messages

class AgentState(TypedDict):

\# Identificación de sesión

student_id: str

session_id: str

current_step: str # 'evaluate'|'analyze'|'tutor'|'new_exam'

\# Datos de la prueba

exam_id: str

exam_answers: List\[dict\] # \[{question_id, selected_option}\]

\# Output Agente 1

evaluation_report: Optional\[dict\] # {score, wrong_answers, by_competency}

\# Output Agente 2

pedagogical_analysis: Optional\[dict\] # {weak_areas, feedback, recovery_test}

recovery_test: Optional\[List\[dict\]\]

\# Output Agente 3 / Chat

messages: Annotated\[List, add_messages\]

tutor_result: Optional\[dict\]

new_exam_requested: bool

\# Metadatos

student_profile: Optional\[dict\] # historial de competencias

error: Optional\[str\]

## **6.3 Implementación de los Nodos**

\# langgraph/nodes.py

from langchain_openai import ChatOpenAI

from langgraph.graph import StateGraph, END

from .state import AgentState

llm = ChatOpenAI(model='gpt-4o', temperature=0.2, streaming=True)

\# ── AGENTE 1: Evaluador ─────────────────────────────────────────

async def evaluator_node(state: AgentState) -> AgentState:

answers = state\['exam_answers'\]

answer_key = await fetch_answer_key(state\['exam_id'\])

report = calculate_scores(answers, answer_key) # puro Python

return {\*\*state, 'evaluation_report': report, 'current_step': 'analyze'}

\# ── AGENTE 2: Pedagogo ──────────────────────────────────────────

async def pedagogy_node(state: AgentState) -> AgentState:

report = state\['evaluation_report'\]

context = await rag_search(report\['wrong_areas'\]) # pgvector

feedback = await llm_chain.ainvoke({'report': report, 'context': context})

test = await generate_recovery_test(report\['weak_areas'\])

return {\*\*state, 'pedagogical_analysis': {'feedback': feedback, ...},

'recovery_test': test, 'current_step': 'tutor'}

\# ── AGENTE 3: Tutor ─────────────────────────────────────────────

async def tutor_node(state: AgentState) -> AgentState:

response = await llm.ainvoke(state\['messages'\]) # con historial

return {\*\*state, 'messages': \[response\]}

\# ── CONDICIONAL: ¿Nueva prueba? ─────────────────────────────────

def should_generate_new_exam(state: AgentState) -> str:

return 'new_exam' if state\['new_exam_requested'\] else 'chat_loop'

\# ── GRAFO ───────────────────────────────────────────────────────

workflow = StateGraph(AgentState)

workflow.add_node('evaluate', evaluator_node)

workflow.add_node('analyze', pedagogy_node)

workflow.add_node('tutor', tutor_node)

workflow.add_edge('evaluate', 'analyze')

workflow.add_edge('analyze', 'tutor')

workflow.add_conditional_edges('tutor', should_generate_new_exam,

{'new_exam': 'evaluate', 'chat_loop': 'tutor'})

workflow.set_entry_point('evaluate')

graph = workflow.compile(checkpointer=pg_checkpointer) # persiste en PG

## **6.4 Gestión de Estado y Memoria**

- Estado de sesión activa: Redis con TTL de 8 horas; contiene el AgentState serializado de la sesión en curso
- Checkpoints entre sesiones: LangGraph SqliteSaver o PostgresSaver persiste el estado del grafo en PostgreSQL para que el estudiante pueda retomar donde lo dejó
- Historial conversacional: los mensajes del chat se almacenan en la tabla tutor_sessions en PostgreSQL y se cargan al iniciar una sesión
- Memoria semántica: pgvector indexa el historial de errores del estudiante como embeddings para recuperación contextual en prompts

**07 Modelo de Datos — PostgreSQL**

El modelo de datos está diseñado en PostgreSQL 16 con la extensión pgvector para soporte de búsqueda vectorial. El esquema sigue principios de normalización (3FN) para datos transaccionales, con columnas JSONB para datos semiestructurados que varían por competencia o configuración.

## **7.1 Tabla: students**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador único del estudiante |
| --- | --- | --- |
| email | VARCHAR(255) UNIQUE | Correo electrónico (login) |
| --- | --- | --- |
| password_hash | VARCHAR(255) | Hash bcrypt de la contraseña |
| --- | --- | --- |
| full_name | VARCHAR(255) | Nombre completo |
| --- | --- | --- |
| institution | VARCHAR(255) | Institución educativa |
| --- | --- | --- |
| grade_level | VARCHAR(50) | Nivel (Grado 11 / Universitario) |
| --- | --- | --- |
| target_exam | VARCHAR(50) | Saber11 \| SaberPro |
| --- | --- | --- |
| created_at | TIMESTAMP WITH TIME ZONE | Fecha de registro |
| --- | --- | --- |
| last_login | TIMESTAMP WITH TIME ZONE | Último acceso al sistema |
| --- | --- | --- |
| is_active | BOOLEAN | Estado de la cuenta |
| --- | --- | --- |

## **7.2 Tabla: questions**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador único de la pregunta |
| --- | --- | --- |
| area | VARCHAR(100) | Área ICFES (Matemáticas, Lectura Crítica...) |
| --- | --- | --- |
| competency | VARCHAR(150) | Competencia evaluada |
| --- | --- | --- |
| component | VARCHAR(150) | Componente específico del ICFES |
| --- | --- | --- |
| difficulty | SMALLINT | Nivel de dificultad 1-5 |
| --- | --- | --- |
| question_text | TEXT | Enunciado de la pregunta |
| --- | --- | --- |
| options | JSONB | \[{letter:A, text:...}, {letter:B,...}\] |
| --- | --- | --- |
| correct_option | CHAR(1) | Letra de la opción correcta |
| --- | --- | --- |
| explanation | TEXT | Explicación pedagógica de la respuesta |
| --- | --- | --- |
| tags | TEXT\[\] | Etiquetas temáticas |
| --- | --- | --- |
| embedding | vector(1536) | Embedding para búsqueda semántica RAG |
| --- | --- | --- |
| created_at | TIMESTAMP | Fecha de creación |
| --- | --- | --- |

## **7.3 Tabla: exam_attempts**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador único del intento |
| --- | --- | --- |
| student_id | UUID FK → students | Estudiante que realizó la prueba |
| --- | --- | --- |
| exam_type | VARCHAR(50) | Simulacro \| Recuperación \| Diagnóstico |
| --- | --- | --- |
| area | VARCHAR(100) | Área evaluada (puede ser múltiple) |
| --- | --- | --- |
| started_at | TIMESTAMP WITH TIME ZONE | Inicio del intento |
| --- | --- | --- |
| submitted_at | TIMESTAMP WITH TIME ZONE | Envío de respuestas |
| --- | --- | --- |
| total_questions | SMALLINT | Total de preguntas en la prueba |
| --- | --- | --- |
| correct_count | SMALLINT | Número de respuestas correctas |
| --- | --- | --- |
| score_pct | DECIMAL(5,2) | Porcentaje de aciertos global |
| --- | --- | --- |
| scores_by_area | JSONB | {area: {correct, total, pct}} |
| --- | --- | --- |
| status | VARCHAR(50) | in_progress \| completed \| abandoned |
| --- | --- | --- |

## **7.4 Tabla: student_answers**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador único de la respuesta |
| --- | --- | --- |
| attempt_id | UUID FK → exam_attempts | Intento al que pertenece |
| --- | --- | --- |
| question_id | UUID FK → questions | Pregunta respondida |
| --- | --- | --- |
| selected_option | CHAR(1) | Opción seleccionada por el estudiante |
| --- | --- | --- |
| is_correct | BOOLEAN | Si la respuesta fue correcta |
| --- | --- | --- |
| time_spent_sec | SMALLINT | Segundos invertidos en la pregunta |
| --- | --- | --- |
| answered_at | TIMESTAMP | Momento de la respuesta |
| --- | --- | --- |

## **7.5 Tabla: pedagogical_profiles**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador del perfil |
| --- | --- | --- |
| student_id | UUID FK → students UNIQUE | Estudiante dueño del perfil |
| --- | --- | --- |
| competency_scores | JSONB | {'area': {'competency': pct_historic}} |
| --- | --- | --- |
| weak_areas | TEXT\[\] | Lista ordenada de áreas más débiles |
| --- | --- | --- |
| strong_areas | TEXT\[\] | Lista de áreas de mejor desempeño |
| --- | --- | --- |
| total_exams | INTEGER | Total de pruebas realizadas |
| --- | --- | --- |
| last_analysis_at | TIMESTAMP | Última actualización del perfil |
| --- | --- | --- |
| embedding | vector(1536) | Embedding del perfil para personalización RAG |
| --- | --- | --- |

## **7.6 Tabla: tutor_sessions**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador de la sesión de tutoría |
| --- | --- | --- |
| student_id | UUID FK → students | Estudiante en sesión |
| --- | --- | --- |
| attempt_id | UUID FK → exam_attempts | Intento que originó la sesión |
| --- | --- | --- |
| langgraph_thread_id | VARCHAR(255) | ID de hilo para checkpoints LangGraph |
| --- | --- | --- |
| messages | JSONB | Array de mensajes \[{role, content, ts}\] |
| --- | --- | --- |
| agent_state_snapshot | JSONB | Snapshot del AgentState al cerrar |
| --- | --- | --- |
| started_at | TIMESTAMP WITH TIME ZONE | Inicio de la sesión |
| --- | --- | --- |
| last_activity | TIMESTAMP WITH TIME ZONE | Última actividad |
| --- | --- | --- |
| status | VARCHAR(50) | active \| closed \| expired |
| --- | --- | --- |

## **7.7 Tabla: academic_content**

| **Columna** | **Tipo** | **Descripción** |
| --- | --- | --- |
| id  | UUID PRIMARY KEY | Identificador del contenido |
| --- | --- | --- |
| area | VARCHAR(100) | Área temática ICFES |
| --- | --- | --- |
| competency | VARCHAR(150) | Competencia relacionada |
| --- | --- | --- |
| title | VARCHAR(255) | Título del material |
| --- | --- | --- |
| content_text | TEXT | Contenido pedagógico para RAG |
| --- | --- | --- |
| source | VARCHAR(255) | Fuente (ICFES, MEN, curado) |
| --- | --- | --- |
| embedding | vector(1536) | Embedding para búsqueda semántica |
| --- | --- | --- |
| created_at | TIMESTAMP | Fecha de indexación |
| --- | --- | --- |

## **7.8 Diagrama de Relaciones**

**\[ MODELO ENTIDAD-RELACIÓN (simplificado) \]**

students ──────────────────────────────────────────────┐

│ 1 │ 1

│ ▼

│ 1:N pedagogical_profiles

▼ (1:1 con student)

exam_attempts ─────────────────────────────────────────┐

│ 1 │ 1

│ 1:N │ 1:1

▼ ▼

student_answers tutor_sessions

│ N │

│ langgraph_thread_id

▼ 1 (enlace a checkpoints PG)

questions

│

│ embedding::vector(1536) ──► pgvector index

│

academic_content

│ embedding::vector(1536) ──► pgvector index

**08 Arquitectura de IA**

## **8.1 Uso del LLM**

El sistema integra modelos de lenguaje de gran escala (LLM) principalmente en los Agentes 2 y 3. El Agente 1 (Evaluador) opera con lógica determinista sin LLM, garantizando evaluaciones exactas y consistentes. Los Agentes 2 y 3 usan el LLM para generación de texto pedagógico personalizado, donde la variabilidad controlada del modelo es un activo y no un riesgo.

| **Agente** | **Uso del LLM** | **Modelo Recomendado** | **Temperatura** |
| --- | --- | --- | --- |
| Agente 1 — Evaluador | Sin LLM (lógica determinista) | N/A | N/A |
| --- | --- | --- | --- |
| Agente 2 — Pedagogo | Genera retroalimentación y explica errores con contexto RAG | GPT-4o / Claude 3.5 Sonnet | 0.2 (preciso) |
| --- | --- | --- | --- |
| Agente 3 — Tutor | Chat conversacional, responde preguntas, adapta explicaciones | GPT-4o / Claude 3.5 Sonnet | 0.5 (natural) |
| --- | --- | --- | --- |

## **8.2 Sistema RAG (Retrieval-Augmented Generation)**

El RAG enriquece la retroalimentación del Agente 2 y las respuestas del Agente 3 con material pedagógico curado, evitando que el LLM genere explicaciones genéricas o incorrectas. El material recuperado está anclado al corpus ICFES oficial, lo que garantiza pertinencia y precisión pedagógica.

**\[ PIPELINE RAG — FLUJO DE RECUPERACIÓN Y GENERACIÓN \]**

INDEXACIÓN (offline / batch):

Preguntas + Material ICFES

│

▼

text-embedding-3-small (OpenAI) ──► vector(1536)

│

▼

pgvector.ivfflat index en PostgreSQL

RECUPERACIÓN (online / por petición):

Query = 'errores del estudiante en área X'

│

▼

Embedding del query ──► cosine similarity search

│

▼

Top-K fragmentos relevantes (K=5)

│

▼

Ensamblado de contexto (retrieved docs + student profile)

│

▼

Prompt: \[System\] + \[Student Context\] + \[RAG Context\] + \[Query\]

│

▼

LLM (GPT-4o) ──► Respuesta pedagógica personalizada

## **8.3 Control de Prompts y Gestión de Memoria**

- System prompts: definidos por agente con rol, restricciones y formato de salida esperado; versionados en el repositorio
- Few-shot examples: incluidos en el prompt del Agente 2 con ejemplos de retroalimentación pedagógica de alta calidad
- Ventana de contexto: el historial de chat se trunca a los últimos N mensajes para no exceder el context window del LLM
- Memoria semántica: el perfil pedagógico del estudiante se inserta como contexto comprimido en el system prompt del Agente 3
- Output parsing: LangChain PydanticOutputParser garantiza que las respuestas del LLM tengan la estructura JSON esperada
- Prompt injection protection: sanitización de inputs del usuario antes de incluirlos en prompts

\# Ejemplo de prompt del Agente 2 (retroalimentación pedagógica)

SYSTEM_PROMPT_AGENT2 = '''

Eres un tutor experto en preparación para el examen ICFES Saber 11 de Colombia.

Tu rol es analizar los errores de un estudiante y generar retroalimentación

pedagógica específica, clara y motivadora.

INSTRUCCIONES:

\- Explica por qué la respuesta del estudiante fue incorrecta

\- Identifica el concepto subyacente que debe reforzar

\- Usa el material de referencia proporcionado (RAG context)

\- Sugiere cómo abordar ese tipo de pregunta en el futuro

\- Mantén un tono positivo y constructivo

\- Responde SIEMPRE en español colombiano

Perfil del estudiante: {student_profile}

Material de referencia: {rag_context}

Errores del estudiante: {wrong_answers}

'''

**09 Frontend de la Plataforma**

## **9.1 React vs Next.js — Análisis y Decisión**

Para este sistema se recomienda Next.js 14 con App Router sobre React puro, por las siguientes razones técnicas y pedagógicas:

| **Criterio** | **React (SPA)** | **Next.js 14 (SSR/SSG)** | **Ventaja** |
| --- | --- | --- | --- |
| SEO | Sin SEO (SPA) | SSR nativo, metadatos por ruta | Next.js |
| --- | --- | --- | --- |
| Carga inicial | Lenta (bundle completo) | Rápida (HTML renderizado en servidor) | Next.js |
| --- | --- | --- | --- |
| Chat en tiempo real | Posible con hooks | Server Actions + WebSockets nativos | Next.js |
| --- | --- | --- | --- |
| Autenticación | Implementación manual | NextAuth.js integrado | Next.js |
| --- | --- | --- | --- |
| API Routes | Requiere backend separado | API Routes nativas /api/\* | Next.js |
| --- | --- | --- | --- |
| Escalabilidad | Alta (CDN) | Alta (CDN + Edge Functions) | Equivalente |
| --- | --- | --- | --- |
| Curva de aprendizaje | Menor | Media (conocer App Router) | React |
| --- | --- | --- | --- |
| Veredicto final | No recomendado para SSR | RECOMENDADO | Next.js |
| --- | --- | --- | --- |

## **9.2 Stack Frontend Definitivo**

- Framework: Next.js 14 con App Router y TypeScript
- Estilos: TailwindCSS 3 + shadcn/ui para componentes accesibles
- Estado global: Zustand para sesión del estudiante y progreso
- Peticiones HTTP: TanStack Query (React Query) para caché y sincronización
- WebSockets: socket.io-client para chat en tiempo real con el Agente 3
- Gráficas: Recharts para dashboard de progreso por competencia
- Formularios: React Hook Form + Zod para validación de respuestas

## **9.3 Estructura de Rutas (App Router)**

app/

├── (auth)/

│ ├── login/page.tsx

│ └── register/page.tsx

├── (dashboard)/

│ ├── layout.tsx // Layout con sidebar y navbar

│ ├── dashboard/page.tsx // Vista principal con progreso

│ ├── exam/

│ │ ├── \[examId\]/page.tsx // Prueba simulada activa

│ │ └── results/\[id\]/page.tsx // Resultados y retroalimentación

│ ├── tutor/

│ │ └── \[sessionId\]/page.tsx // Chat con Agente 3

│ └── progress/page.tsx // Historial y estadísticas

├── api/

│ └── \[...nextauth\]/ // NextAuth.js handler

└── layout.tsx // Root layout (providers)

## **9.4 Flujo de UX del Estudiante**

1.  Registro e ingreso: formulario simple con institución y tipo de examen objetivo
2.  Dashboard inicial: resumen de competencias con gráfica de radar ICFES y CTA 'Iniciar prueba'
3.  Selección de prueba: área temática, número de preguntas y modalidad (cronometrado / libre)
4.  Ejecución de la prueba: una pregunta por pantalla, navegación libre, indicador de progreso
5.  Resultados inmediatos: puntaje, gráfica por competencia, listado de errores con explicación del Agente 2
6.  Chat con el tutor: transición natural al Agente 3 para profundizar en errores específicos
7.  Test de recuperación: el tutor propone el test; el estudiante lo realiza en la misma sesión
8.  Confirmación de nueva prueba: el tutor sugiere una nueva prueba completa si el progreso lo justifica

## **9.5 Dashboard de Progreso**

- Gráfica de radar con las 5 áreas ICFES (Lectura Crítica, Matemáticas, Inglés, Ciencias, Sociales)
- Línea de tiempo de puntajes históricos por área con tendencia de mejora
- Tarjetas de fortalezas y debilidades actualizadas automáticamente tras cada prueba
- Mapa de calor de errores por tipo de pregunta y competencia
- Contador de pruebas realizadas, preguntas respondidas y tiempo invertido

**10 Infraestructura y Despliegue**

## **10.1 Contenerización con Docker**

Cada microservicio tiene su propio Dockerfile optimizado con imágenes base python:3.12-slim. Docker Compose gestiona el entorno local de desarrollo con todos los servicios, mientras que en producción se utiliza un servidor cloud con Docker Engine o un orquestador como Docker Swarm o AWS ECS.

\# docker-compose.yml (desarrollo local)

version: '3.9'

services:

nginx: # API Gateway / Reverse proxy

image: nginx:alpine

ports: \['80:80', '443:443'\]

depends_on: \[auth, student, questions, evaluation, pedagogy, tutor, embeddings\]

auth: { build: ./services/auth, ports: \['8001:8001'\] }

student: { build: ./services/student, ports: \['8002:8002'\] }

questions: { build: ./services/questions, ports: \['8003:8003'\] }

evaluation: { build: ./services/evaluation, ports: \['8004:8004'\] }

pedagogy: { build: ./services/pedagogy, ports: \['8005:8005'\] }

tutor: { build: ./services/tutor, ports: \['8006:8006'\] }

embeddings: { build: ./services/embeddings, ports: \['8007:8007'\] }

reporting: { build: ./services/reporting, ports: \['8008:8008'\] }

frontend: { build: ./frontend, ports: \['3000:3000'\] }

postgres:

image: pgvector/pgvector:pg16

environment:

POSTGRES_DB: tutordb

POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}

volumes: \['pgdata:/var/lib/postgresql/data'\]

redis:

image: redis:7-alpine

command: redis-server --requirepass ${REDIS_PASSWORD}

volumes:

pgdata:

## **10.2 Diagrama de Infraestructura Cloud**

**\[ ARQUITECTURA DE DESPLIEGUE EN SERVIDOR CLOUD \]**

Internet

│

▼

┌─────────────────────────────────────────────────────────────────┐

│ SERVIDOR CLOUD (VPS / EC2) │

│ │

│ ┌─────────────────────────────────────────────────────────┐ │

│ │ NGINX (puerto 80 / 443) │ │

│ │ TLS/SSL · Rate Limiting · Reverse Proxy │ │

│ └──────┬──────────────┬──────────────┬────────────────────┘ │

│ │ │ │ │

│ ┌──────▼──┐ ┌───────▼──┐ ┌──────▼──────────────────────┐ │

│ │ Frontend│ │ API │ │ Servicios Backend │ │

│ │ Next.js │ │ Services │ │ auth · student · questions │ │

│ │ :3000 │ │ :8001-08 │ │ eval · pedagogy · tutor │ │

│ └─────────┘ └──────────┘ └────────────────┬────────────┘ │

│ │ │

│ ┌──────────────────────────────────────────────▼──────────┐ │

│ │ RED INTERNA DOCKER │ │

│ │ PostgreSQL :5432 │ Redis :6379 │ │

│ │ (pgvector habilitado)│ (sesiones + caché) │ │

│ └─────────────────────────────────────────────────────────┘ │

│ │

│ Volúmenes persistentes: /data/postgres /data/redis │

└─────────────────────────────────────────────────────────────────┘

│

▼

Servicios Externos: OpenAI API · Anthropic API · SMTP

## **10.3 Gestión de Variables de Entorno**

\# .env.example (cada servicio tiene su propio .env)

\# Base de datos

DATABASE_URL=postgresql+asyncpg://user:pass@postgres:5432/tutordb

REDIS_URL=redis://:password@redis:6379/0

\# APIs de LLM

OPENAI_API_KEY=sk-...

ANTHROPIC_API_KEY=sk-ant-...

\# JWT

JWT_SECRET_KEY=&lt;generated-256-bit-secret&gt;

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=60

\# Configuración del servicio

SERVICE_NAME=auth-service

LOG_LEVEL=INFO

ENVIRONMENT=production

\# Monitoring

SENTRY_DSN=https://...

## **10.4 CI/CD con GitHub Actions**

- Rama develop: ejecuta tests unitarios, linting (ruff) y type checking (mypy) en cada push
- Rama main: construye imágenes Docker, las publica en registry y despliega en servidor cloud via SSH
- Tests de integración: se ejecutan en un entorno Docker Compose efímero antes del despliegue
- Rollback automático: si el health check falla post-despliegue, se revierte a la imagen anterior

**11 Diagramas de Arquitectura y UML**

## **11.1 Diagrama de Componentes UML**

**\[ UML COMPONENT DIAGRAM \]**

&lt;<component&gt;> Frontend (Next.js)

├── ExamModule → usa → EvaluationService

├── TutorChatModule → usa → TutorIAService (WebSocket)

└── DashboardModule → usa → StudentService, ReportingService

&lt;<component&gt;> APIGateway (Nginx)

└── routesTo → \[Auth, Student, Questions, Evaluation, Pedagogy, Tutor, Embeddings, Reporting\]

&lt;<component&gt;> AuthService → depende de → PostgreSQL

&lt;<component&gt;> StudentService → depende de → PostgreSQL

&lt;<component&gt;> QuestionsService → depende de → PostgreSQL

&lt;<component&gt;> EvaluationService → depende de → PostgreSQL, LangGraphOrchestrator

&lt;<component&gt;> PedagogyService → depende de → PostgreSQL, EmbeddingsService, LangGraphOrchestrator

&lt;<component&gt;> TutorIAService → depende de → PostgreSQL, Redis, LangGraphOrchestrator

&lt;<component&gt;> EmbeddingsService → depende de → PostgreSQL\[pgvector\], OpenAI

&lt;<component&gt;> ReportingService → depende de → PostgreSQL

&lt;<component&gt;> LangGraphOrchestrator

├── EvaluatorNode (Agente 1)

├── PedagogyNode (Agente 2) → usa → EmbeddingsService\[RAG\]

└── TutorNode (Agente 3) → usa → OpenAI LLM, EmbeddingsService\[RAG\]

## **11.2 Diagrama de Secuencia — Flujo Principal (Evaluación + Retroalimentación)**

**\[ UML SEQUENCE DIAGRAM — SUBMIT EXAM TO FEEDBACK \]**

Student Frontend EvalService LangGraph PedService OpenAI

│ │ │ │ │ │

│─submit─────►│ │ │ │ │

│ │─POST /eval/─►│ │ │ │

│ │ │─graph.invoke─►│ │ │

│ │ │ │─EvaluatorNode│ │

│ │ │ │ (no LLM) │ │

│ │ │ │─PedagogyNode─►│ │

│ │ │ │ │─RAG search │

│ │ │ │ │ pgvector │

│ │ │ │ │─gen prompt─►│

│ │ │ │ │ │─►feedback│

│ │ │ │◄─────────────────────────│

│ │ │◄─state──────│ │ │

│ │◄─response───│ │ │ │

│◄─results────│ │ │ │ │

│ │ │ │ │ │

│─start_chat─►│ │ │ │ │

│ │─WS connect──►\[TutorService\] │ │

│ │ │─────────────►│(TutorNode) │ │

│─question───►│─────────────────────────────────────────────────────►│

│ │◄────────────────────────────────────────────streaming─│

│◄─response───│ │ │ │ │

## **11.3 Diagrama de Flujo entre Agentes**

**\[ AGENT INTERACTION FLOW \]**

┌───────────────────────────────────────────────────────────────────────┐

│ LANGGRAPH STATE MACHINE │

│ │

│ INPUT │

│ {student_id, exam_id, answers\[\]} │

│ │ │

│ ┌────▼────────────────────────────────────────────────────────────┐ │

│ │ AGENTE 1 — EvaluatorNode │ │

│ │ Input: answers\[\], answer_key (from DB) │ │

│ │ Logic: set_difference(answers, key) → score calculation │ │

│ │ Output: {score, wrong_ids\[\], scores_by_area{}, competencies{}}│ │

│ └────────────────────────────────────┬───────────────────────────┘ │

│ │ always

│ ┌────────────────────────────────────▼───────────────────────────┐ │

│ │ AGENTE 2 — PedagogyNode │ │

│ │ Input: evaluation_report, student_profile │ │

│ │ RAG: pgvector search → top-5 pedagogy fragments │ │

│ │ LLM: generate(feedback, recovery_test_spec) │ │

│ │ Output: {feedback_text, weak_areas\[\], recovery_test\[\]} │ │

│ └────────────────────────────────────┬───────────────────────────┘ │

│ │ always

│ ┌────────────────────────────────────▼───────────────────────────┐ │

│ │ AGENTE 3 — TutorNode │ │

│ │ Input: messages\[\], analysis, student_profile │ │

│ │ LLM: chat_completion(history + RAG context) │ │

│ │ Loop: awaits user messages via WebSocket │ │

│ │ Output: response_text | new_exam_request │ │

│ └─────────────────────────────────────────────────────────────┬─┘ │

│ ┌──────────────────────┘ │

│ new_exam? │ │

│ YES ────────┘ ──► graph.set_entry_point │

│ NO ────────► continue chat_loop │

└───────────────────────────────────────────────────────────────────────┘

**12 Riesgos del Proyecto y Mitigaciones**

## **12.1 Riesgos Técnicos**

| **Riesgo** | **Nivel** | **Impacto** | **Mitigación** |
| --- | --- | --- | --- |
| Complejidad del grafo LangGraph: flujos mal diseñados pueden generar bucles infinitos o estados huérfanos | Alto | El estudiante queda en un estado sin respuesta; degradación del servicio | Definir estados terminales explícitos. Implementar timeout por nodo (30s). Tests de integración que recorren todos los caminos del grafo. |
| --- | --- | --- | --- |
| Latencia alta de la API de OpenAI (>10s) que degrada la experiencia conversacional del tutor | Medio | El estudiante percibe el sistema como lento; abandono de la sesión | Implementar streaming de tokens con WebSockets. Cache semántica de respuestas frecuentes con Redis. Fallback a modelo más rápido (GPT-4o-mini) si latencia >5s. |
| --- | --- | --- | --- |
| Acoplamiento involuntario entre microservicios por comunicación directa excesiva | Medio | Un fallo en cascada puede tumbar múltiples servicios simultáneamente | Definir contratos API con OpenAPI. Circuit breakers con tenacity. Revisión de arquitectura en cada sprint para detectar acoplamiento creciente. |
| --- | --- | --- | --- |
| Inconsistencia del estado del AgentState entre peticiones concurrentes del mismo estudiante | Alto | Resultados incorrectos o sesiones corruptas si el estudiante abre múltiples tabs | Usar session locks en Redis por student_id. Diseño idempotente de nodos. Tests de concurrencia antes del despliegue. |
| --- | --- | --- | --- |

## **12.2 Riesgos Pedagógicos**

| **Riesgo** | **Nivel** | **Impacto** | **Mitigación** |
| --- | --- | --- | --- |
| El LLM genera retroalimentación pedagógica incorrecta o imprecisa sobre contenidos ICFES específicos | Alto | El estudiante refuerza conceptos erróneos; daño a la confianza en el sistema | RAG estricto anclado a material ICFES oficial. Temperatura baja (0.2) en Agente 2. Evaluación periódica por docentes expertos de muestras de retroalimentación generada. |
| --- | --- | --- | --- |
| El Agente 1 comete errores en la evaluación por datos incorrectos en el banco de preguntas | Medio | Reportes de desempeño incorrectos que engañan al estudiante sobre su nivel real | Suite de tests unitarios sobre el evaluador con todos los casos borde. Proceso de curación doble para el banco de preguntas. Mecanismo de reporte de errores por parte del estudiante. |
| --- | --- | --- | --- |

## **12.3 Riesgos de Escalabilidad**

| **Riesgo** | **Nivel** | **Impacto** | **Mitigación** |
| --- | --- | --- | --- |
| El sistema no soporta la carga en épocas de exámenes ICFES (pico de usuarios simultáneos) | Alto | Tiempo de respuesta inaceptable o caída del servicio en el momento de mayor necesidad | Load testing con Locust antes de cada temporada de exámenes. Escalado horizontal de los servicios de mayor carga (Tutor, Evaluation). Health checks automáticos con restart de contenedores. |
| --- | --- | --- | --- |
| El costo de las APIs de LLM crece desproporcionadamente con el volumen de usuarios | Medio | Inviabilidad económica del proyecto sin fuente de financiamiento | Monitoreo de costos con límites por período. Caché de respuestas frecuentes. Evaluación de migración a modelos open-source (Llama 3) para casos de uso simples. |
| --- | --- | --- | --- |

## **12.4 Riesgos de Seguridad y Privacidad**

| **Riesgo** | **Nivel** | **Impacto** | **Mitigación** |
| --- | --- | --- | --- |
| Exposición de datos personales de estudiantes (incluyendo menores de edad) por brechas de seguridad | Muy Alto | Implicaciones legales bajo Ley 1581 de 2012 (Habeas Data Colombia); daño reputacional | TLS en todas las comunicaciones. JWT con expiración corta + refresh tokens. No almacenar datos innecesarios. Política de privacidad clara. Revisión de seguridad antes del lanzamiento público. |
| --- | --- | --- | --- |
| Prompt injection: un estudiante construye inputs que manipulan el comportamiento del LLM | Medio | El tutor puede comportarse de forma inesperada o revelar información del sistema | Sanitización de inputs del usuario antes de incluirlos en prompts. Instrucciones de seguridad en el system prompt. Monitoreo de respuestas anómalas del LLM. |
| --- | --- | --- | --- |

**13 Roadmap de Desarrollo**

El desarrollo se organiza en siete fases secuenciales con entregables verificables al final de cada una. Las fases 1-3 construyen la base del sistema; las fases 4-6 implementan la inteligencia; la fase 7 lleva el sistema a producción robusta.

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 1 — Fundaciones de Infraestructura y Backend</strong> ▸ Semanas 1-4</p><p><em>Establecer la base sobre la que se construirá todo el sistema</em></p></th></tr><tr><th><ul><li>Repositorio monorepo con estructura de servicios definida (services/, frontend/, infra/)</li><li>Docker Compose funcional con PostgreSQL+pgvector, Redis y Nginx</li><li>Servicio Auth: registro, login, JWT con refresh tokens, pruebas unitarias completas</li><li>Servicio Student: CRUD de perfil, historial básico, endpoints documentados</li><li>Migraciones de base de datos con Alembic; esquema completo de tablas</li><li>GitHub Actions: linting (ruff), type checking (mypy), tests en cada push</li><li>Variables de entorno centralizadas; .env.example documentado</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 2 — Sistema de Evaluación — Agente 1</strong> ▸ Semanas 5-8</p><p><em>Banco de preguntas funcional y evaluación automática de pruebas</em></p></th></tr><tr><th><ul><li>Servicio Questions: CRUD de preguntas, categorización por área ICFES, generación de pruebas</li><li>Carga inicial del banco de preguntas: mínimo 300 preguntas Saber 11 curadas</li><li>Servicio Evaluation: validación de respuestas, cálculo de puntajes, reporte estructurado</li><li>Implementación del Agente 1 (EvaluatorNode) en LangGraph sin LLM — lógica determinista</li><li>Tests unitarios con cobertura &gt;90% del evaluador (todos los casos borde)</li><li>API documentada y verificada con Postman/Insomnia</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 3 — Analítica Pedagógica — Agente 2</strong> ▸ Semanas 9-13</p><p><em>Retroalimentación personalizada con RAG e integración del LLM</em></p></th></tr><tr><th><ul><li>Servicio Embeddings: indexación de preguntas y material pedagógico en pgvector</li><li>Pipeline RAG completo: embedding de queries, búsqueda por similaridad, ensamblado de contexto</li><li>Agente 2 (PedagogyNode) con LLM: retroalimentación generada con RAG y perfil del estudiante</li><li>Servicio Pedagogy: análisis de competencias, generación de tests de recuperación</li><li>Tabla pedagogical_profiles actualizada automáticamente tras cada evaluación</li><li>Evaluación de calidad de retroalimentación con muestra de preguntas por docentes</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 4 — Tutor IA Conversacional — Agente 3</strong> ▸ Semanas 14-18</p><p><em>Chat pedagógico en tiempo real con memoria y contexto</em></p></th></tr><tr><th><ul><li>Servicio Tutor IA: WebSockets con FastAPI, streaming de respuestas LLM</li><li>Agente 3 (TutorNode) con historial conversacional y memory management</li><li>Integración del grafo completo: Agente1 → Agente2 → Agente3 con persistencia en PostgreSQL</li><li>Checkpoints LangGraph en PostgreSQL para continuidad entre sesiones</li><li>Evaluación del test de recuperación dentro del flujo del Agente 3</li><li>Generación de nueva prueba simulada desde el chat del tutor</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 5 — Frontend Completo</strong> ▸ Semanas 19-24</p><p><em>Interfaz de usuario completa e integrada con todos los servicios</em></p></th></tr><tr><th><ul><li>Next.js 14 con autenticación (NextAuth.js), rutas protegidas y layout principal</li><li>Módulo de prueba simulada: presentación de preguntas, temporizador, envío</li><li>Módulo de resultados: visualización del reporte del Agente 1 y retroalimentación del Agente 2</li><li>Módulo de chat con el Agente 3: interfaz conversacional con streaming en tiempo real</li><li>Dashboard de progreso: gráfica de radar, línea de tiempo, mapa de calor de errores</li><li>Diseño responsivo y accesible (WCAG 2.1 AA); pruebas en móvil y desktop</li><li>Pruebas de usabilidad con estudiantes reales; iteración de diseño</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 6 — Orquestación Multiagente y Pruebas de Integración</strong> ▸ Semanas 25-28</p><p><em>Sistema completo integrado y probado end-to-end</em></p></th></tr><tr><th><ul><li>Pruebas de integración end-to-end del flujo completo (estudiante → prueba → retroalimentación → chat)</li><li>Load testing con Locust: objetivo 200 usuarios concurrentes sin degradación</li><li>Hardening de seguridad: revisión de autenticación, sanitización de inputs, headers HTTP</li><li>Monitoreo: integración con Sentry para errores, métricas básicas de latencia</li><li>Documentación técnica completa: README, diagramas actualizados, guía de despliegue</li><li>Revisión pedagógica final: evaluación de calidad de retroalimentación por expertos</li></ul></th></tr></thead></table></div>

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>FASE 7 — Escalamiento y Observabilidad</strong> ▸ Semanas 29-36</p><p><em>Sistema listo para producción con usuarios reales</em></p></th></tr><tr><th><ul><li>Migración a servidor cloud robusto con configuración de producción</li><li>Implementación de backups automáticos de PostgreSQL y Redis</li><li>Monitoreo de costos de API LLM con alertas por umbral</li><li>Escalado horizontal de servicios de alta carga (Tutor, Evaluation) con Docker Swarm</li><li>Servicio Reporting completo: exportación PDF de reportes individuales</li><li>Panel de administración para gestión del banco de preguntas</li><li>Lanzamiento piloto con institución educativa colaboradora; recopilación de métricas reales</li><li>Ciclo de mejora basado en feedback: ajuste de prompts, UX y rendimiento</li></ul></th></tr></thead></table></div>

**14 Conclusión**

La arquitectura de microservicios con sistema multiagente orquestado por LangGraph presentada en este documento constituye la base técnica más adecuada para construir el Tutor Virtual Universitario como una plataforma real, escalable y mantenible. Cada decisión arquitectónica está fundamentada en las características específicas del problema: la naturaleza pedagógica del flujo de tres agentes, la necesidad de personalización por estudiante y los requisitos de escalabilidad para llegar a miles de usuarios.

<div class="joplin-table-wrapper"><table><thead><tr><th><p><strong>Argumentos que respaldan la arquitectura seleccionada</strong></p><ul><li>Modularidad real: los ocho microservicios tienen fronteras claras que permiten desarrollo paralelo por equipos y actualizaciones independientes sin afectar el sistema completo</li><li>Inteligencia de estado nativa: LangGraph proporciona gestión de estado, memoria, checkpoints y flujos condicionales sin código personalizado, reduciendo la deuda técnica y aumentando la confiabilidad del sistema multiagente</li><li>Escalabilidad planificada: la arquitectura soporta escalar individualmente los servicios de mayor demanda (Tutor IA, Evaluation) sin rediseñar el sistema, protegiendo la inversión de desarrollo</li><li>Stack Python coherente: toda la pila backend usa Python, eliminando la fragmentación de conocimiento del equipo y aprovechando el ecosistema de IA más maduro disponible en 2025</li><li>Retroalimentación pedagógica de calidad: el sistema RAG con pgvector garantiza que el LLM genere explicaciones ancladas en material ICFES oficial, no en conocimiento genérico del modelo</li><li>Hoja de ruta ejecutable: el roadmap de siete fases descompone el proyecto en entregas verificables que reducen el riesgo de un desarrollo monolítico de largo aliento</li><li>Preparación para producción: Docker, GitHub Actions y el diseño stateless de los servicios garantizan un camino claro desde el prototipo hasta un sistema en producción con usuarios reales</li></ul></th></tr></thead></table></div>

El Tutor Virtual Universitario, construido sobre esta arquitectura, tiene el potencial de democratizar el acceso a preparación de calidad para las Pruebas de Estado colombianas, contribuyendo a reducir las brechas de desempeño que históricamente han limitado el acceso a la educación superior. La combinación de rigor técnico en la arquitectura y profundidad pedagógica en el diseño del sistema multiagente posiciona este proyecto como una contribución genuina tanto al campo de la tecnología educativa como al sistema educativo colombiano.

**Documento de Arquitectura Técnica — Versión 1.0**

_Semillero de Investigación en Tecnología Educativa e Inteligencia Artificial | 2025_