# Manual de Despliegue DevOps - SIPRO UDC

## 1. Introducción

**Objetivo del manual:**
El presente manual está dirigido al equipo de Operaciones y Desarrollo (DevOps) de SIPRO UDC. Su propósito es definir, contrastar y documentar las estrategias de despliegue en entornos de producción. No solo detalla el *cómo* llevar a producción la aplicación, sino que justifica el *por qué* de las decisiones arquitectónicas elegidas para garantizar alta disponibilidad, eficiencia térmica de recursos y seguridad.

**Contexto del sistema:**
SIPRO UDC es una aplicación de arquitectura dividida (Decoupled System):
- **Frontend:** Single Page Application y Server-Side Rendering mediante **Next.js 14** (App Router).
- **Backend:** API RESTful robusta, síncrona/asíncrona construida en **Python y FastAPI**.
- **Motor de Datos:** Base de Datos Relacional **PostgreSQL** alojada como DbaaS (Supabase).

Dado que ambas aplicaciones (Node.js y Python) corren en contextos de SO y manejadores de paquetes distintos, su convivencia requiere estrategias de despliegue que manejen el balanceo de proxy inverso o arquitecturas de PaaS distribuidas para una interconexión pulcra.

---

## 2. Consideraciones Generales

**Requisitos previos:**
- Dominio propio o subdominio asignado.
- Acceso de administrador a la Base de Datos de Producción (Supabase/Aiven).
- Repositorio unificado en control de versiones basado en Git (GitHub, GitLab, Bitbucket).

**Variables de entorno requeridas:**
*Backend (`.env`):*
- `DATABASE_URL`: URI estricta de PostgreSQL (producción).
- `SECRET_KEY`: Llave SHA robusta para firmado (JWT).
- `ALGORITHM`: Típicamente "HS256".
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Tiempo (ej. 30).

*Frontend (`.env.production`):*
- `NEXT_PUBLIC_API_URL`: URL remota pública donde reside la API de FastAPI.

**Dependencias Críticas:**
- Frontend depende intrínsecamente del paquete `next` el cual en producción requiere su propio proceso `next start` (a diferencia del empaquetado de Vite que entrega solo HTML estático).
- El backend corre mediante ASGI server (`uvicorn` / `gunicorn`), necesitando inyección de bindings `psycopg[binary]` para entablar el túnel con Supabase.

---

## 3. Estrategia de despliegue recomendada (Arquitectura PaaS Desacoplada)

**Descripción general:**
Esta estrategia consiste en desplegar el **Frontend en Vercel** (Edge Network) y el **Backend en Railway (o Render)** usando contenedores ocultos, mientras la Base de Datos permanece en la capa original en DbaaS (**Supabase**).

**Justificación (Por qué es la mejor opción):**
- **Sinergia nativa (Next.js - Vercel):** Al ser los creadores de Next.js, Vercel compila, divide chunks y levanta Lambdas (Edge Functions) automáticamente, ofreciendo un CDN global sin fricción ni configuraciones.
- **Micro-Deployments Backend (Railway):** Railway usa Buildpacks que detectan `requirements.txt` y `main.py`, levantando el Gunicorn automáticamente sin requerir lidiar con NGINX ni certificados SSL manuales.
- **Sin estado y auto-escalable:** Ambas plataformas son agnósticas a instancias fijas, escalando automáticamente si llega tráfico universitario denso y logrando Cero Tiempo de Inactividad (Zero Downtime) al momento del despliegue mediante CI/CD embebido.

**Tecnologías utilizadas:**
- Plataforma as a Service (PaaS): **Vercel** (Frontend) + **Railway** (Backend).
- Integración Continua (Built-in CI/CD).
- **Supabase** para la capa de Persistencia (PostgreSQL).

**Arquitectura del Despliegue:**
1. Internet accede a `siproudc.com` apuntando al CDN de **Vercel**.
2. Las llamadas de cliente (Axios/Fetch) dentro del navegador cruzan hacia `api.siproudc.com` apuntando a **Railway**.
3. FastAPI en Railway resuelve túnel de datos (ORM) directo hacia **Supabase** usando strings SSL.
4. Cualquier *Push* en la rama `main` en GitHub, Vercel y Railway jalan el commit simultáneamente y redespliegan.

---

## 4. Guía Paso a Paso (Estrategia Recomendada)

### Preparación del entorno
1. Transicionar los logs y configuraciones genéricas fuera de local, creando los `.env` definitivos.
2. Verificar que `frontend/package.json` tenga sus build scripts definidos correctamente (`"build": "next build"`).
3. Asegurar que `backend/requirements.txt` posee `uvicorn` y opcionalmente `gunicorn`.

### Instalación en Railway (Backend)
1. **Conexión a Repositorio:** Ingresar a Railway, seleccionar "New -> GitHub Repo". Seleccionar el repositorio unificado de SIPRO UDC.
2. **Setup Directorio Raíz:** En Railway *Settings -> Build*, definir "Root Directory" a `/backend`.
3. **Comando de Arranque:** Railway detectará Python. En la sección "Start Command" especificar: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.
4. **Variables de Entorno:** Llenar el apartado "Variables" con `DATABASE_URL`, `SECRET_KEY`, etc.
5. **SSL:** Railway proveerá una URL pública en HTTPS de inmediato. (Guardar para el Frontend).

### Instalación en Vercel (Frontend)
1. Conectar cuenta Vercel a GitHub, seleccionar "Nueva Respuesta (New Project)" y escoger la rama main.
2. Cambiar "Root Directory" a `/frontend`. Vercel auto-configura los build commands como Next.js Framework.
3. En Environment Variables alojar: `NEXT_PUBLIC_API_URL=https://[URL-DE-TU-RAILWAY]`.
4. Iniciar Deploy.

### Verificación del sistema
1. Visitar el enlace público emitido por Vercel.
2. Intentar registrar un usuario. Verificar cascada de logs visualmente en la terminal Web de Railway para asegurar un HTTP 200 OK de FastAPI.

### Posibles errores y soluciones
- *Fallo CORS en navegador:* Asegurarse de que en `app/main.py` de FastAPI el arreglo de `allow_origins=` tenga agregada la URL canónica de Vercel (ej `https://mi-panel-vercel.app`).
- *Dial error en PostgreSQL:* Verificar en Railway que la variable `DATABASE_URL` empiece por `postgresql+psycopg://` y no `postgres://`.

---

## 5. Estrategias Alternativas

### Alternativa 1: Despliegue en Contenedores (Docker + Docker Compose)

**Descripción:**
Crear `Dockerfile` separados para Frontend y Backend y atarlos mediante un archivo `docker-compose.yml` desplegándolos sobre una Máquina Virtual o VPS (ej. AWS EC2 Ubuntu o DigitalOcean Droplet).

**Tecnologías:** Docker, Docker Compose, Traefik o NGINX, VPS Linux.

**Ventajas:**
- Aislamiento absoluto de procesos, predictibilidad ambiental (lo que corre en local, corre igual en producción).
- No hay Vendor Lock-In (se puede mover toda la solución de la Nube A a la Nube B en una tarde).

**Desventajas:**
- Requiere gestión agresiva de Infraestructura (Instalación de NGINX de proxy interno, gestión de certificados SSL Let's Encrypt o Certbot, monitoreo constante de CPU de la instancia central).

**Cuándo usarla:**
Cuando la Universidad requiera alojar el sistema bajo On-Premise Systemas (Servidores alojados dentro del clúster físico de la universidad sin salir a Internet Público) por políticas de Datos Personales o requerimientos gubernamentales específicos.

### Alternativa 2: Despliegue Tradicional (Servidor Físico / VM Clásico)

**Descripción:**
Instalar físicamente Node.js y Python Runtime en un entorno bare-metal o VM. Usar manejadores de procesos robustos donde no imperan contenedores.

**Tecnologías:** NGINX, PM2 (para Next.js), Systemd / Supervisor, Gunicorn / Uvicorn, Entornos Virtuales Pip (`venv`).

**Ventajas:**
- Tiempos de compilación locales a veces insuperables en entornos limitados, cero overhead de virtualización Docker.
- Control manual forense extremo sobre los logs del sistema.

**Desventajas:**
- Las caídas por Fallos Locales o desbordamientos de memoria del servidor no son autocurables a menos de programar engorrosos scripts Bash con cronjobs (Carece de Alta Disponibilidad / Escalabilidad horizontal automatizada).
- Riesgo severo de "Configuration Drift" (entornos estropeados si se instalan pip dependencies en scope global).

**Cuándo usarla:**
Solo válido si existe infraestructura Legacy monolítica y el cliente exige cero cuotas por servicios adicionales externos, contando con ingenieros dedicados 24/7.

---

## 6. Comparativa Final

| Criterio | PaaS (Vercel + Railway) | Contenedores (Docker VPS) | Tradicional (PM2/NGINX) |
|----------|-------------------------|---------------------------|-------------------------|
| **Complejidad** | Baja | Alta | Alta |
| **Escalabilidad** | Automática (Elástica) | Manual (Scale up EC2) | Muy Limitada |
| **Costo** | $ (Nivel Gratuito o por GiB usado) | $$ (Pago recurrente por VM VPS) | $$ (Pago por consumo o Hierro) |
| **Mantenimiento**| Cero Ops (Gestionado) | Medio (Auditorias Docker updates) | Intensivo (Gestión parches OS) |
| **Facilidad Deploy**| Integración push to deploy | Requiere GitHub Actions o SSH | SSH, Git pull, reloads manuales |

---

## 7. Recomendación Final

Se recomienda enérgicamente optar por la estrategia de **Plataformas como Servicio (PaaS / Arquitectura Desacoplada)** empleando **Vercel (Frontend)** y **Railway/Render (Backend)** unidos a Supabase.
**Justificación Lógica:** El perfil de la herramienta (tutor escolar) exhibe alto tráfico concurrente transitorio (ej. época de simulacros universitarios) de lectura que Vercel absorberá mediante su Edge Cache. Los mantenimientos tradicionales en AWS EC2 supondrían tiempos de inactividad perjudiciales; sin embargo, al usar un esquema PaaS, cualquier ingeniero, sin conocimientos amplios sobre Linux, Bash o Nginx, puede redesplegar solo subiendo un Merge Request en GitHub. El costo actual es ideal para aplicaciones que buscan minimizar "DevOps Overhead" mientras maximizan "Time to Market".

---

## 8. Buenas Prácticas y Políticas de Producción

**Seguridad (DevSecOps):**
- **CORS Estricto:** Asegurarse de quitar `allow_origins=["*"]` en `main.py` de producción y poner explícitamente el FQDN final `["https://siproudc.mx"]`.
- **Secretos:** Jamás guardar archivos `.env` en los commits Github (asegurarse de que permanezcan en el `.gitignore`).

**Automatización Pipeline (CI/CD):**
- Añadir Pruebas Automatizadas previas al Despliegue. Usando *Husky* o *GitHub Actions*, prohibiendo un "Push" a producción si los perfiles locales detectan lints de TypeScript (NextJS) quebrantados.

**Monitoreo y Logging:**
- Sustituir la terminal estándar de Python por **Sentry** instalando su SDK de FastAPI. Capturará todos los errores 500 originados en las respuestas a estudiantes enviando el volcado estructurado a Slack/Dashboard sin perjudicar al usuario.
- En caso de Vercel, habilitar la pestaña Web Analytics (Speed Insights) para vigilar LCP (Largest Contentful Paint) y métricas WebVitals del usuario final.
