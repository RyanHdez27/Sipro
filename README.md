# SIPRO UDC — Tutor Virtual con IA

**Sistema Integral de Preparación para el Saber Pro - UDC**  
Aplicación Full-Stack para el aprendizaje adaptativo con Tutor de IA. Desarrollado con **Next.js 14 (App Router)** + **FastAPI** + **Supabase PostgreSQL**.

---

## 📁 Estructura del Proyecto

```text
/
├── /backend                    # API Python — FastAPI
│   ├── app/
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   ├── auth.py        # Login, Registro (estudiante + docente)
│   │   │   │   ├── users.py       # Perfil de usuario (/users/me)
│   │   │   │   └── admin.py       # Stats, códigos, registro manual, logs
│   │   │   └── dependencies.py    # get_current_user (JWT)
│   │   ├── core/
│   │   │   ├── config.py          # Settings desde .env
│   │   │   └── security.py        # bcrypt hash, JWT encode/decode
│   │   ├── db/
│   │   │   └── database.py        # Engine + SessionLocal (Supabase)
│   │   ├── models/
│   │   │   └── user.py            # User, TeacherCode, LoginLog
│   │   ├── schemas/
│   │   │   ├── user.py            # Pydantic schemas
│   │   │   └── token.py           # Token response
│   │   └── main.py                # FastAPI app + CORS + routers
│   ├── venv/                      # Entorno virtual Python (local)
│   ├── .env                       # DATABASE_URL, SECRET_KEY, ALGORITHM
│   └── requirements.txt
├── /frontend                      # Aplicación Web — Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/              # Login, Registro, Reset password
│   │   │   ├── admin/             # Dashboard admin + /admin/profile (Config)
│   │   │   ├── profesor/          # Vista Profesor + /profesor/profile
│   │   │   └── dashboard/         # Vista Estudiante + Prueba Simulada + Resultados + Tutor IA
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx # Guard de rutas por rol
│   │   │   ├── UserNav.tsx        # Menú desplegable de usuario
│   │   │   └── ui/                # shadcn/ui components
│   │   ├── hooks/
│   │   │   └── useAuth.ts         # Estado de sesión + timeout 5 min
│   │   ├── lib/
│   │   │   └── api.ts             # Cliente centralizado (13 funciones)
│   │   └── pages_old/             # Componentes legacy (Dashboard, Prueba, Resultados, Tutor)
│   └── .env.local                 # NEXT_PUBLIC_API_URL
└── README.md
```

---

## 🚀 Puesta en Marcha

### Backend (FastAPI)

> **Requisito:** Python 3.11 o 3.12. Python 3.13 puede generar conflictos con SQLAlchemy.

```bash
cd backend

# Primera vez
python -m venv venv
.\\venv\\Scripts\\activate          # Windows
source venv/bin/activate           # Mac / Linux
pip install -r requirements.txt

# Iniciar servidor
.\\venv\\Scripts\\uvicorn app.main:app --reload
```

- API: **http://localhost:8000**  
- Swagger UI: **http://localhost:8000/docs**

> ⚠️ Usa siempre `.\\venv\\Scripts\\uvicorn` (no el `uvicorn` global) para evitar conflictos de versiones.

### Frontend (Next.js 14)

```bash
cd frontend
npm install
npm run dev
```

- App: **http://localhost:3000**  
- Sin sesión activa redirige automáticamente a `/auth/login`.

---

## ⚙️ Variables de Entorno

**`backend/.env`**
```env
DATABASE_URL=postgresql+psycopg://usuario:contraseña@host:5432/postgres
SECRET_KEY=tu_clave_secreta
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**`frontend/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🗂️ Rutas del Frontend

| Ruta | Rol | Descripción |
|------|-----|-------------|
| `/auth/login` | Todos | Inicio de sesión con correo institucional |
| `/auth/register` | Público | Registro de estudiante |
| `/auth/register?type=teacher` | Público | Registro de docente (requiere código de admin) |
| `/auth/reset-password` | Público | Restablecimiento de contraseña |
| `/dashboard` | 🎓 Estudiante | Panel principal: radar de competencias, historial de pruebas |
| `/dashboard/profile` | 🎓 Estudiante | Perfil + Configuración (Académico, Progreso, Seguridad) |
| `/dashboard/prueba-simulada` | 🎓 Estudiante | Prueba simulada (12 preguntas, 6 áreas, 120 min) |
| `/dashboard/resultados` | 🎓 Estudiante | Resultados detallados + test de recuperación |
| `/dashboard/tutor-ia` | 🎓 Estudiante | Chat con Tutor de IA |
| `/profesor` | 👨‍🏫 Profesor | Panel principal del docente |
| `/profesor/profile` | 👨‍🏫 Profesor | Perfil + Configuración (Materias, Cuenta, Académicas) |
| `/admin` | 🛡️ Admin | Dashboard: Vista General, Materias, Docentes, Estudiantes |
| `/admin/profile` | 🛡️ Admin | Configuración: Accesos, Seguridad, Notificaciones |

---

## 🔐 Autenticación y Roles (RBAC)

El sistema implementa control de acceso basado en roles con JWT (Bearer Token).

| Rol | Acceso |
|-----|--------|
| **Estudiante** | Pruebas simuladas Saber Pro, Tutor IA, resultados propios |
| **Profesor** | Analítica de grupos, gestión de contenidos y materias |
| **Administrador** | Control total: usuarios, códigos, logs de seguridad, configuración |

**Flujos clave:**
- El **login** registra automáticamente un `LoginLog` en la BD (éxito o fallo, con IP y user-agent).
- El JWT contiene el rol; el frontend redirige automáticamente a la vista correspondiente.
- `ProtectedRoute.tsx` bloquea rutas de otros roles y redirige al dashboard correcto.
- El **timeout de inactividad** (5 minutos) cierra la sesión automáticamente.

---

## 🛡️ Panel de Administración

### Dashboard (`/admin`)

| Vista | Descripción |
|-------|-------------|
| **Vista General** | 4 cards (Total Estudiantes, Total Docentes, Promedio General, Tasa Aprobación) + 3 gráficas funcionales (Crecimiento, Distribución, Rendimiento por Área) |
| **Materias** | Tabla ponderada con las 6 competencias Saber Pro (promedio, aprobados, tasa) + gráfica de estudiantes por área |
| **Estudiantes** | Top 5 + clasificación en tiempo real (En riesgo / Regulares / Sobresalientes) |
| **Docentes** | Tabla real de docentes registrados en la plataforma (datos del backend) |

### Configuración (`/admin/profile`)

| Pestaña | Estado | Descripción |
|---------|--------|-------------|
| **Perfil** | Frontend | Información personal del admin |
| **Accesos** | ✅ Backend | Generación de códigos (BD), registro manual de docentes (BD), registro con código (BD), log de códigos en tiempo real |
| **Seguridad** | ✅ Backend | Logs de login reales (BD), límites del sistema (frontend) |
| **Notificaciones** | Frontend | Envío simulado de notificaciones masivas con historial de sesión |

**Códigos de Docente:**
- Se generan desde Accesos → "Generar Código"
- Formato: `DOC-XXXXXX` (6 caracteres alfanuméricos)
- Validez: **8 días** desde la creación
- Un solo uso: al registrar un docente con el código, se consume automáticamente
- Se pueden revocar manualmente antes de expirar

---

## 🎓 Prueba Simulada Saber Pro

La plataforma evalúa 6 competencias con 12 preguntas (2 por área):

| Área | Preguntas |
|------|-----------|
| Matemáticas | 2 |
| Lectura Crítica | 2 |
| Ciencias Naturales | 2 |
| Razonamiento Cuantitativo | 2 |
| Inglés | 2 |
| Ciencias Sociales | 2 |

- Tiempo límite: **120 minutos** con cuenta regresiva en vivo
- Al finalizar, los resultados se guardan en `localStorage` y se visualizan en el dashboard del estudiante
- Incluye test de recuperación para reforzar áreas débiles

---

## 🎨 Diseño y UI

- **Framework:** Tailwind CSS + shadcn/ui
- **Modo Oscuro:** Soporte completo con clases `dark:`
- **Gráficas:** Recharts (BarChart, PieChart, AreaChart, RadarChart)
- **Layout de auth:** Split-screen (branding izquierda + formulario derecha)
  - Login → Azul (`blue-700`)
  - Registro → Esmeralda (`emerald-600`)
  - Reset → Violeta (`violet-700`)
- **UserNav:** Menú desplegable en todas las vistas con Perfil y Cerrar sesión

---

## 🧩 API Endpoints

### Auth
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/register` | Registro de estudiante |
| `POST` | `/auth/register/teacher` | Registro docente (requiere código válido) |
| `POST` | `/auth/login` | Login → JWT + registra log en BD |
| `POST` | `/auth/reset-password` | Recuperación de contraseña |

### Users
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/users/me` | Perfil del usuario autenticado |
| `PUT` | `/users/me` | Actualizar perfil |

### Admin (requiere rol admin)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/admin/stats` | Conteo de usuarios + listas |
| `POST` | `/admin/codes` | Generar código de docente |
| `GET` | `/admin/codes` | Listar todos los códigos con estado |
| `DELETE` | `/admin/codes/{code}` | Revocar un código |
| `POST` | `/admin/register-teacher` | Registrar docente manualmente (sin código) |
| `GET` | `/admin/login-logs` | Últimos 50 logs de login |
| `DELETE` | `/admin/login-logs` | Limpiar todos los logs |

### Sistema
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Estado del servidor |

---

## 📊 Modelos de Base de Datos

### `users`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Integer (PK) | ID único |
| `name` | String | Nombre completo |
| `email` | String (unique) | Correo electrónico |
| `hashed_password` | String | Contraseña hasheada (bcrypt) |
| `role` | Enum | `estudiante` / `profesor` / `admin` |
| `is_active` | Boolean | Estado de la cuenta |

### `teacher_codes`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Integer (PK) | ID único |
| `code` | String (unique) | Código `DOC-XXXXXX` |
| `is_used` | Boolean | Si fue consumido |
| `used_by_name` | String | Nombre del docente que lo usó |
| `created_at` | DateTime | Fecha de creación |
| `expires_at` | DateTime | Fecha de expiración (8 días) |
| `created_by_id` | Integer (FK) | Admin que lo generó |

### `login_logs`
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | Integer (PK) | ID único |
| `user_email` | String | Email del intento |
| `action` | String | Descripción de la acción |
| `ip` | String | Dirección IP del cliente |
| `user_agent` | String | Navegador/OS del cliente |
| `success` | Boolean | Si el login fue exitoso |
| `created_at` | DateTime | Timestamp del evento |

---

## 📝 Notas Técnicas

- **JWT Claims:** El payload incluye `sub` (email) y `role`; el frontend lo usa para redirigir y el backend para autorizar con `require_admin`.
- **Códigos de Docente:** Se invalidan automáticamente al vencer (8 días) o al ser consumidos (transacción atómica en BD).
- **Login Logs:** Cada intento de login (exitoso o fallido) se registra automáticamente con IP y user-agent.
- **Cliente API centralizado:** `src/lib/api.ts` contiene 13 funciones que cubren toda la comunicación frontend ↔ backend.
- **Datos de rendimiento:** Los resultados de pruebas se almacenan en `localStorage` del estudiante. El dashboard admin usa datos simulados derivados de los usuarios reales para estadísticas.

---

## 👥 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | `admin@siproudc.com` | `Admin123!` |
| Profesor | `julioprofe@iudc.com` | `Profesor123!` |
| Estudiante | `ryanhdez27@iudc.com` | `Estudiante123!` |

## RAMA AGENTES
