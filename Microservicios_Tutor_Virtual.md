**TUTOR VIRTUAL UNIVERSITARIO**

Preparación Pruebas Saber Pro

Documentación de Microservicios Internos — Guía de Construcción

Versión 1.0 · Semillero de Investigación en Tecnología Educativa e IA · 2025

# **1\. ¿Qué son los Microservicios y por qué el Proyecto los Necesita?**

Un microservicio es un programa pequeño e independiente que hace una sola cosa muy bien. En lugar de construir un solo programa gigante que haga todo, el proyecto divide el sistema en 8 programas separados, cada uno con su propio trabajo específico.

Cada microservicio tiene su propia dirección (puerto), sus propias entradas y salidas, y puede actualizarse sin afectar a los demás. Se comunican entre sí enviándose mensajes por la red interna del servidor.

|     |
| --- |
| **¿Por qué 8 microservicios y no un solo programa?** |
| Si algo falla en un servicio (por ejemplo el chat), los simulacros y el login siguen funcionando. |
| Se puede mejorar o corregir un servicio sin tocar los demás — menos riesgo al actualizar. |
| Cada parte puede crecer de forma independiente: si el chat se usa mucho, solo se escala ese servicio. |
| Equipos distintos pueden trabajar en paralelo en servicios distintos. |

## **1.1 Visión general de los 8 microservicios**

A continuación se muestra el mapa completo de los 8 servicios, qué hace cada uno y en qué puerto vive:

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| **#** | **Servicio** | **Puerto** | **¿Qué hace?** | **Lo usan** |
| S1  | Auth Service | 8001 | Login, registro y validación de tokens JWT | Todos los demás servicios |
| S2  | Student Service | 8002 | Perfiles, historial y progreso de los estudiantes | Frontend, Pedagogy, Reporting |
| S3  | Questions Service | 8003 | Banco de preguntas ICFES y generación de simulacros | Evaluation, Pedagogy, Embeddings |
| S4  | Evaluation Service | 8004 | Califica el simulacro (Agente 1) y dispara el flujo | Frontend, LangGraph |
| S5  | Pedagogy Service | 8005 | Retroalimentación pedagógica (Agente 2) | Evaluation, Tutor, Frontend |
| S6  | Tutor IA Service | 8006 | Chat en tiempo real con el estudiante (Agente 3) | Frontend (WebSocket) |
| S7  | Embeddings Service | 8007 | Indexa material en pgvector y hace búsquedas RAG | Pedagogy, Tutor |
| S8  | Reporting Service | 8008 | Genera reportes PDF y los envía por correo | Frontend, Docentes |

## **1.2 Tecnologías usadas para construirlos**

|     |     |
| --- | --- |
| **Lenguaje** | Python 3.12 — el lenguaje de todo el backend |
| **Framework** | FastAPI — crea los endpoints REST de cada servicio de forma sencilla |
| **Base de datos** | PostgreSQL — se conectan todos los servicios a la misma BD |
| **Contenedores** | Docker — cada servicio corre en su propio contenedor aislado |
| **Comunicación** | HTTP REST entre servicios · WebSocket para el chat en tiempo real |
| **Orquestación IA** | LangGraph — coordina los 3 agentes dentro de los servicios S4, S5, S6 |

# **2\. S1 — Auth Service**

|     |     |     |
| --- | --- | --- |
| **S1** | **Auth Service**<br><br>Login, registro y validación de tokens JWT | **Puerto 8001** |

## **¿Para qué sirve?**

Es el portero del sistema. Nadie puede entrar a ningún servicio sin pasar primero por Auth. Cuando un estudiante inicia sesión, Auth le entrega un token (como una pulsera de acceso). Los demás servicios le preguntan a Auth si ese token es válido antes de responder cualquier petición.

## **¿Por qué es necesario?**

- Sin Auth, cualquier persona podría acceder a los datos de cualquier estudiante sin restricción.
- Centraliza la seguridad — si hay que cambiar cómo funciona el login, se cambia solo aquí.
- Los tokens JWT tienen fecha de vencimiento, así que las sesiones se cierran automáticamente.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| POST | /auth/register | Registra un nuevo estudiante con email y contraseña |
| POST | /auth/login | Valida credenciales y devuelve el token de acceso JWT |
| POST | /auth/verify | Verifica si un token es válido (lo usan los demás servicios) |
| GET | /auth/me | Devuelve los datos del estudiante autenticado |
| POST | /auth/refresh | Renueva el token antes de que expire |
| GET | /health | Indica si el servicio está funcionando correctamente |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear el archivo main.py con FastAPI y configurar la conexión a PostgreSQL |
| **2** | Implementar el endpoint /auth/register: recibir email y contraseña, hashear la contraseña con bcrypt y guardar en la tabla students |
| **3** | Implementar /auth/login: buscar el estudiante por email, comparar la contraseña, generar el token JWT con fecha de expiración |
| **4** | Implementar /auth/verify: decodificar el token y devolver si es válido o no — este es el que usan todos los demás servicios |
| **5** | Crear el Dockerfile y el requirements.txt con las dependencias (fastapi, bcrypt, python-jose) |
| **6** | Agregar el servicio al docker-compose.yml en el puerto 8001 |
| **7** | Probar con Postman: registrar un usuario, hacer login, usar el token para llamar /auth/me |

|     |
| --- |
| **Librerías Python que necesita** |
| fastapi — el framework para crear los endpoints |
| bcrypt — para hashear las contraseñas de forma segura |
| python-jose — para generar y verificar los tokens JWT |
| sqlalchemy + asyncpg — para conectarse a PostgreSQL de forma asíncrona |

# **3\. S2 — Student Service**

|     |     |     |
| --- | --- | --- |
| **S2** | **Student Service**<br><br>Gestiona perfiles, historial y progreso de los estudiantes | **Puerto 8002** |

## **¿Para qué sirve?**

Maneja toda la información del estudiante como persona: su perfil académico, el historial de todos los simulacros que ha hecho y su progreso acumulado por competencia a lo largo del tiempo.

El dashboard del frontend (la pantalla de progreso) consume principalmente este servicio para mostrarle al estudiante cómo ha mejorado.

## **¿Por qué es necesario?**

- Separa los datos del estudiante de la lógica de evaluación — cada servicio tiene su responsabilidad.
- El Agente 2 consulta el historial de competencias aquí para personalizar la retroalimentación.
- Los docentes pueden consultar el progreso grupal a través de este servicio.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| GET | /students/{id} | Devuelve el perfil completo del estudiante |
| PUT | /students/{id} | Actualiza datos del perfil (programa, semestre, etc.) |
| GET | /students/{id}/progress | Devuelve el puntaje de dominio por competencia |
| GET | /students/{id}/history | Lista todos los simulacros realizados con sus puntajes |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. Importar la conexión a PostgreSQL |
| **2** | En cada endpoint, llamar primero a Auth Service (/auth/verify) para validar el token del estudiante |
| **3** | Implementar GET /students/{id}: consultar la tabla students y devolver el perfil en JSON |
| **4** | Implementar GET /students/{id}/progress: consultar la tabla student_mastery con JOIN a competencies |
| **5** | Implementar GET /students/{id}/history: consultar assessments y results con LEFT JOIN para obtener puntajes |
| **6** | Implementar PUT /students/{id}: actualizar solo los campos que lleguen en el body (programa, semestre) |
| **7** | Crear Dockerfile, requirements.txt y agregar al docker-compose en puerto 8002 |

# **4\. S3 — Questions Service**

|     |     |     |
| --- | --- | --- |
| **S3** | **Questions Service**<br><br>Administra el banco de preguntas ICFES y genera los simulacros | **Puerto 8003** |

## **¿Para qué sirve?**

Es la biblioteca de preguntas del sistema. Guarda todas las preguntas del banco ICFES con su enunciado, opciones de respuesta, clave correcta, explicación y nivel de dificultad. Cuando se necesita un simulacro, este servicio elige preguntas aleatorias según los criterios definidos.

También guarda las claves de respuesta de forma separada para que los estudiantes no puedan acceder a ellas — solo el Agente 1 puede consultarlas durante la calificación.

## **¿Por qué es necesario?**

- Centraliza el banco de preguntas — si hay que agregar o corregir una pregunta, se hace solo aquí.
- Separa las claves de respuesta del enunciado para evitar que los estudiantes las vean.
- Genera simulacros aleatorios según competencia y dificultad sin código repetido en otros servicios.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| GET | /questions/{id} | Devuelve una pregunta sin la clave de respuesta (para el estudiante) |
| GET | /questions/{id}/answer | Devuelve la clave de respuesta (solo para el Agente 1) |
| POST | /questions/exam | Genera un simulacro con N preguntas aleatorias por competencia |
| POST | /questions | Crea una nueva pregunta en el banco (solo administradores) |
| GET | /questions/categories | Lista todas las competencias disponibles del ICFES |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI y la conexión a PostgreSQL |
| **2** | Implementar GET /questions/{id}: consultar la tabla questions con JOIN a competencies, devolver todo EXCEPTO answer_key |
| **3** | Implementar GET /questions/{id}/answer: devolver answer_key y explanation — este endpoint es interno, solo lo llama Evaluation Service |
| **4** | Implementar POST /questions/exam: recibir configuración (n_questions, competency_codes, difficulty_max) y hacer un SELECT aleatorio con ORDER BY RANDOM() |
| **5** | Implementar POST /questions para que los administradores puedan cargar preguntas nuevas al banco |
| **6** | Implementar GET /questions/categories: listar todas las competencias de la tabla competencies |
| **7** | Crear Dockerfile y requirements.txt. Agregar al docker-compose en puerto 8003 |

# **5\. S4 — Evaluation Service**

|     |     |     |
| --- | --- | --- |
| **S4** | **Evaluation Service**<br><br>Ejecuta el Agente 1 y dispara el flujo de los 3 agentes | **Puerto 8004** |

## **¿Para qué sirve?**

Es el servicio más importante del flujo pedagógico. Recibe las respuestas del estudiante cuando termina el simulacro, ejecuta el Agente 1 (la calificación determinista en Python), guarda el resultado en la base de datos y dispara automáticamente el Agente 2 en segundo plano para que empiece a generar la retroalimentación.

Es el punto de entrada de todo el flujo de los 3 agentes — sin este servicio, el ciclo pedagógico no arranca.

## **¿Por qué es necesario?**

- Centraliza la lógica de calificación — el Agente 1 solo existe aquí, no está disperso.
- Al terminar de calificar, dispara al Agente 2 en segundo plano (background task) para que el estudiante no tenga que esperar.
- Guarda el historial de cada intento con sus respuestas para trazabilidad y auditoría.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| POST | /evaluation/submit | Recibe las respuestas, califica (Agente 1) y dispara el Agente 2 |
| GET | /evaluation/{id}/report | Devuelve el reporte completo de un simulacro calificado |
| GET | /evaluation/{id}/status | Indica si el simulacro está en progreso, enviado o calificado |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. La lógica del Agente 1 vive aquí como función Python pura — sin LLM |
| **2** | Implementar la función evaluate_answers(): recibe las respuestas del estudiante y las claves oficiales, compara una por una y calcula puntajes por competencia |
| **3** | En POST /evaluation/submit: validar token → obtener claves de Questions Service → ejecutar evaluate_answers() → guardar resultado en la tabla results |
| **4** | Usar Background Tasks de FastAPI para llamar a Pedagogy Service después de guardar el resultado, sin que el estudiante espere |
| **5** | Implementar GET /evaluation/{id}/report: consultar la tabla results y devolver el report_json |
| **6** | Implementar GET /evaluation/{id}/status: consultar el campo status de la tabla assessments |
| **7** | Crear Dockerfile, requirements.txt (agregar httpx para llamar a otros servicios) y agregar al docker-compose en puerto 8004 |

|     |
| --- |
| **Detalle del Agente 1 — lógica que se implementa aquí** |
| Recibe: lista de respuestas del estudiante + claves oficiales del Questions Service |
| Compara: cada respuesta seleccionada vs la respuesta correcta oficial |
| Calcula: total correctas, total incorrectas, porcentaje global |
| Agrupa: resultados por competencia (Lectura Crítica, Razonamiento Cuantitativo, etc.) |
| Clasifica: tipo de error por pregunta (conceptual, interpretativo, procedimental) |
| Devuelve: report_json estructurado que recibe el Agente 2 |

# **6\. S5 — Pedagogy Service**

|     |     |     |
| --- | --- | --- |
| **S5** | **Pedagogy Service**<br><br>Ejecuta el Agente 2 — genera la retroalimentación pedagógica | **Puerto 8005** |

## **¿Para qué sirve?**

Ejecuta el Agente 2. Recibe el reporte del Evaluation Service, busca material relevante del ICFES usando el RAG (HuggingFace + Cohere), llama a ChatGPT 4o-mini para generar la retroalimentación personalizada, y produce el diagnóstico con el test de recuperación.

Este servicio es el que le da valor pedagógico real al sistema. Sin él, el tutor solo diría cuántas preguntas acertó el estudiante, pero no por qué se equivocó ni cómo mejorar.

## **¿Por qué es necesario?**

- Separa la retroalimentación inteligente de la calificación — cada cosa en su servicio.
- Usa el RAG para que las explicaciones estén ancladas en el material oficial del ICFES, no en conocimiento genérico del LLM.
- Actualiza el perfil pedagógico del estudiante en student_mastery después de cada análisis.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| POST | /pedagogy/analyze | Recibe el reporte del Agente 1 y ejecuta el Agente 2 completo |
| GET | /pedagogy/{student_id}/profile | Devuelve el perfil pedagógico acumulado del estudiante |
| GET | /pedagogy/{student_id}/feedback | Devuelve la última retroalimentación generada |
| POST | /pedagogy/recovery-test | Genera un test de recuperación basado en las debilidades actuales |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. Este servicio necesita LangChain y LangGraph instalados |
| **2** | Implementar la función de búsqueda RAG: llamar al Embeddings Service para obtener los fragmentos más relevantes según las áreas débiles del estudiante |
| **3** | Implementar POST /pedagogy/analyze: construir el prompt del Agente 2 con el report_json + contexto RAG + perfil del estudiante |
| **4** | Llamar a ChatGPT 4o-mini con el prompt y parsear la respuesta JSON con el diagnóstico, acciones recomendadas y test de recuperación |
| **5** | Guardar los resultados en competency_results y actualizar student_mastery en la base de datos |
| **6** | Implementar GET /pedagogy/{id}/profile: consultar student_mastery con JOIN a competencies |
| **7** | Crear Dockerfile y requirements.txt (agregar langchain, langchain-openai, httpx). Puerto 8005 |

|     |
| --- |
| **Flujo interno del Agente 2 en este servicio** |
| 1\. Recibe report_json del Evaluation Service |
| 2\. Extrae las competencias con porcentaje < 70% (áreas débiles) |
| 3\. Llama al Embeddings Service: buscar material ICFES relevante a esas áreas |
| 4\. Construye el prompt: \[system prompt Agente 2\] + \[report_json\] + \[material RAG\] + \[perfil estudiante\] |
| 5\. Llama a ChatGPT 4o-mini con temperatura 0.2 (respuesta precisa y estructurada) |
| 6\. Parsea la respuesta JSON: diagnostic_summary, weak_competences, recovery_test_blueprint |
| 7\. Actualiza student_mastery en la base de datos con los nuevos puntajes |

# **7\. S6 — Tutor IA Service**

|     |     |     |
| --- | --- | --- |
| **S6** | **Tutor IA Service**<br><br>Ejecuta el Agente 3 — chat en tiempo real con WebSockets | **Puerto 8006** |

## **¿Para qué sirve?**

Es el servicio con el que el estudiante interactúa directamente. Maneja el chat en tiempo real usando WebSockets (una conexión abierta y permanente entre el navegador del estudiante y el servidor). Ejecuta el Agente 3, guarda el historial de la conversación y detecta cuando el estudiante quiere hacer un nuevo simulacro.

A diferencia de los otros servicios que responden una petición y terminan, este mantiene la conexión abierta durante toda la sesión de chat para que el intercambio sea fluido y en tiempo real.

## **¿Por qué es necesario?**

- El chat requiere WebSockets — no puede funcionar con peticiones HTTP normales porque el estudiante espera respuestas inmediatas mientras escribe.
- Guarda el historial de mensajes en chat_messages para que el Agente 3 recuerde lo que se habló.
- Genera un resumen automático de la conversación (conversation_summary) para no perder contexto cuando el historial es muy largo.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| POST | /tutor/session/start | Crea una nueva sesión de tutoría y devuelve el session_id |
| WS  | /tutor/chat/{session_id} | WebSocket del chat en tiempo real con el Agente 3 |
| GET | /tutor/session/{session_id} | Devuelve los datos de una sesión activa |
| DELETE | /tutor/session/{session_id} | Cierra manualmente una sesión de tutoría |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. Importar WebSocket y WebSocketDisconnect de FastAPI |
| **2** | Implementar POST /tutor/session/start: crear un registro en chat_sessions y devolver el session_id al frontend |
| **3** | Implementar el WebSocket /tutor/chat/{session_id}: al conectarse, cargar el historial de mensajes previos de la base de datos |
| **4** | En el loop del WebSocket: recibir el mensaje del estudiante → guardarlo en chat_messages → construir el estado del Agente 3 → llamar al LLM → enviar la respuesta de vuelta al estudiante |
| **5** | Detectar palabras clave en los mensajes del estudiante ('nueva prueba', 'nuevo simulacro') para saber cuando redirigir al flujo de Evaluation |
| **6** | Al desconectarse el estudiante, marcar la sesión como cerrada en chat_sessions |
| **7** | Crear Dockerfile, requirements.txt (agregar langchain, langchain-openai, websockets). Puerto 8006 |

|     |
| --- |
| **Diferencia entre HTTP y WebSocket — por qué este servicio es especial** |
| HTTP normal: el cliente pregunta → el servidor responde → la conexión se cierra. Una petición, una respuesta. |
| WebSocket: el cliente y el servidor abren un canal permanente. Pueden mandarse mensajes en cualquier momento. |
| El chat necesita WebSocket porque el estudiante no puede esperar una nueva conexión cada vez que escribe una línea. |
| En la práctica: el frontend en Next.js abre un WebSocket al iniciar el chat y lo mantiene abierto hasta que el estudiante cierra la ventana. |

# **8\. S7 — Embeddings Service**

|     |     |     |
| --- | --- | --- |
| **S7** | **Embeddings Service**<br><br>Indexa material académico en pgvector y gestiona el RAG | **Puerto 8007** |

## **¿Para qué sirve?**

Es el motor de búsqueda inteligente del sistema. Tiene dos trabajos: primero, cuando se carga material académico (guías ICFES, banco de preguntas), lo convierte en vectores usando HuggingFace y los guarda en pgvector. Segundo, cuando los Agentes 2 y 3 necesitan buscar material relevante para un error, este servicio hace la búsqueda semántica + el reranking de Cohere y devuelve los 3 fragmentos más útiles.

## **¿Por qué es necesario?**

- Centraliza toda la lógica de embeddings y búsqueda vectorial — los Agentes 2 y 3 no tienen que saber cómo funciona pgvector ni Cohere, solo llaman a este servicio.
- Separa la indexación (offline, cuando se carga material) del uso en tiempo real (durante el chat).
- Si en el futuro se cambia el modelo de embeddings o el proveedor de reranking, solo se cambia aquí.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| POST | /embeddings/index | Indexa un documento académico nuevo en pgvector (modo batch) |
| POST | /embeddings/index-questions | Indexa todas las preguntas del banco que no tengan embedding |
| POST | /embeddings/search | Búsqueda semántica + Cohere reranking (lo usan S5 y S6) |
| POST | /embeddings/reindex | Re-indexa todo el material cuando se cambia el modelo de embeddings |
| GET | /embeddings/status | Indica cuántos documentos y preguntas están indexados |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. Instalar langchain-huggingface y cohere |
| **2** | Inicializar el modelo de embeddings HuggingFace al arrancar el servicio (intfloat/multilingual-e5-large) |
| **3** | Implementar POST /embeddings/index: recibir texto dividido en chunks → llamar a HuggingFace para generar el vector de cada chunk → guardar en la tabla content_chunks con su embedding |
| **4** | Implementar POST /embeddings/search: recibir el query → generar su embedding con HuggingFace → buscar top-10 en pgvector → enviar los 10 a Cohere Rerank → devolver los 3 mejores |
| **5** | Implementar POST /embeddings/index-questions: indexar todas las preguntas del banco que tengan embedding NULL |
| **6** | Implementar GET /embeddings/status: contar cuántos chunks y preguntas tienen embedding en la BD |
| **7** | Crear Dockerfile y requirements.txt (agregar langchain-huggingface, cohere, asyncpg). Puerto 8007 |

|     |
| --- |
| **Cuándo se indexa el material — proceso único al arrancar el sistema** |
| Paso 1: El administrador sube las guías de estudio del ICFES al servidor. |
| Paso 2: Llama a POST /embeddings/index con el contenido dividido en fragmentos de ~500 palabras. |
| Paso 3: HuggingFace genera un vector de 1024 números por cada fragmento. |
| Paso 4: Los vectores se guardan en pgvector. Este proceso se hace UNA SOLA VEZ. |
| Desde ese momento, el chat en tiempo real nunca llama a HuggingFace — solo busca en pgvector. |

# **9\. S8 — Reporting Service**

|     |     |     |
| --- | --- | --- |
| **S8** | **Reporting Service**<br><br>Genera reportes PDF y los envía por correo institucional | **Puerto 8008** |

## **¿Para qué sirve?**

Genera los reportes visuales del desempeño de los estudiantes en formato PDF y los envía por el servidor de correo de la universidad. También produce reportes grupales para los docentes con el resumen del rendimiento de todos sus estudiantes.

## **¿Por qué es necesario?**

- Los docentes y coordinadores necesitan reportes descargables para presentar en reuniones académicas.
- Los estudiantes valoran recibir su reporte por correo como constancia de sus simulacros.
- Separa la generación de reportes de la lógica de evaluación — más fácil de mantener y personalizar.

## **Endpoints que el equipo debe construir**

|     |     |     |
| --- | --- | --- |
| **Método** | **Ruta** | **¿Qué hace?** |
| GET | /reports/student/{id} | Lista todos los reportes disponibles de un estudiante |
| POST | /reports/export | Genera el PDF de un simulacro y opcionalmente lo envía por correo |
| GET | /reports/group | Reporte grupal con el promedio de todos los estudiantes (para docentes) |
| GET | /reports/analytics | Métricas generales de uso de la plataforma |
| GET | /health | Indicador de salud del servicio |

## **Pasos para construirlo**

|     |     |
| --- | --- |
| **1** | Crear main.py con FastAPI. Instalar WeasyPrint para generar PDFs desde HTML |
| **2** | Implementar la función generate_html_report(): crear un template HTML con los datos del simulacro, puntajes por competencia y recomendaciones |
| **3** | En POST /reports/export: consultar el resultado del simulacro → generar el HTML → convertir a PDF con WeasyPrint |
| **4** | Implementar el envío por SMTP usando las credenciales del servidor de correo institucional (smtplib de Python, ya incluido, sin librería externa) |
| **5** | Implementar GET /reports/group: consultar assessments y results de todos los estudiantes con AVG y GROUP BY |
| **6** | Implementar GET /reports/analytics: métricas globales (total simulacros, promedio general, competencias más débiles) |
| **7** | Crear Dockerfile y requirements.txt (agregar weasyprint). Puerto 8008 |

# **10\. Cómo se Comunican los Servicios Entre Sí**

Los servicios no pueden llamarse directamente por nombre de archivo como en un programa normal — se hablan por HTTP como si fueran sitios web diferentes dentro de la misma red del servidor.

## **10.1 Patrón de comunicación estándar**

Cada vez que un servicio necesita datos de otro, hace una petición HTTP interna usando la librería httpx de Python. La URL usa el nombre del servicio en Docker (por ejemplo http://auth:8001) en lugar de localhost, porque Docker les da nombres de dominio automáticamente.

|     |     |     |
| --- | --- | --- |
| **Cuando...** | **Este servicio llama a...** | **Para qué** |
| Un estudiante hace login | Auth Service (S1) | Verificar credenciales y generar token |
| El estudiante envía sus respuestas | Questions Service (S3) | Obtener las claves de respuesta correctas |
| El simulacro termina de calificarse | Pedagogy Service (S5) | Disparar el análisis del Agente 2 |
| El Agente 2 necesita material ICFES | Embeddings Service (S7) | Buscar fragmentos relevantes por RAG |
| El Agente 3 responde en el chat | Embeddings Service (S7) | Buscar material para la respuesta |
| Cualquier servicio recibe una petición | Auth Service (S1) | Verificar que el token del estudiante es válido |

## **10.2 Patrón de seguridad — verificación del token**

Cada microservicio verifica el token del estudiante antes de responder cualquier petición. El flujo es siempre el mismo: recibir la petición con el token → llamar a Auth Service → si el token es válido, procesar → si no es válido, rechazar con error 401.

|     |
| --- |
| **Por qué cada servicio verifica el token y no solo Auth** |
| Si solo Auth verificara, cualquier petición interna entre servicios sería desprotegida. |
| Al verificar en cada servicio, se garantiza que incluso si alguien logra acceder a la red interna, no puede hacer nada sin un token válido. |
| Es un principio de seguridad llamado 'defensa en profundidad' — múltiples capas de protección. |

# **11\. Orden Recomendado para Construir los Servicios**

No todos los servicios son igual de urgentes. Este es el orden recomendado para que el equipo pueda ir probando el sistema de forma incremental:

|     |     |     |
| --- | --- | --- |
| **Fase** | **Servicios a construir** | **¿Qué se puede probar al terminar?** |
| Fase 1 Semanas 1-4 | S1 Auth · S2 Student · Base de datos | Login, registro y perfiles de estudiantes funcionando |
| Fase 2 Semanas 5-8 | S3 Questions · S4 Evaluation | Simulacros completos con calificación automática (Agente 1) |
| Fase 3 Semanas 9-13 | S7 Embeddings · S5 Pedagogy | Retroalimentación pedagógica completa (Agente 2) con RAG |
| Fase 4 Semanas 14-18 | S6 Tutor IA | Chat conversacional en tiempo real (Agente 3) |
| Fase 5 Semanas 19-24 | S8 Reporting | Reportes PDF y notificaciones por correo |

|     |
| --- |
| **Regla de oro: construir de adentro hacia afuera** |
| Primero: Auth y base de datos — todo lo demás depende de esto. |
| Segundo: Questions y Evaluation — el corazón del simulacro. |
| Tercero: Embeddings y Pedagogy — la inteligencia pedagógica. |
| Cuarto: Tutor — el chat que el estudiante experimenta directamente. |
| Quinto: Reporting — la capa de comunicación y presentación de resultados. |

## **11.1 Resumen de dependencias entre servicios**

Este diagrama muestra qué servicios dependen de cuáles. Siempre hay que construir primero el servicio del que dependen los demás:

|     |     |     |
| --- | --- | --- |
| **Servicio** | **Depende de** | **Lo necesitan** |
| S1 Auth | Solo PostgreSQL | Todos los demás servicios |
| S2 Student | S1 Auth · PostgreSQL | Frontend · S5 Pedagogy · S8 Reporting |
| S3 Questions | S1 Auth · PostgreSQL | S4 Evaluation · S5 Pedagogy · S7 Embeddings |
| S4 Evaluation | S1 Auth · S3 Questions · PostgreSQL | Frontend · S5 Pedagogy |
| S5 Pedagogy | S1 Auth · S4 Evaluation · S7 Embeddings | S6 Tutor · Frontend |
| S6 Tutor | S1 Auth · S5 Pedagogy · S7 Embeddings | Frontend (WebSocket) |
| S7 Embeddings | S1 Auth · PostgreSQL+pgvector · HuggingFace · Cohere | S5 Pedagogy · S6 Tutor |
| S8 Reporting | S1 Auth · S2 Student · S4 Evaluation · SMTP | Frontend · Docentes |