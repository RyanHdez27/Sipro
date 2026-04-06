# SIPRO UDC — Tutor Virtual con IA

**Sistema Integral de Preparación para el Saber Pro - UDC**  
Aplicación Full-Stack para el aprendizaje adaptativo con Tutor de IA. Desarrollado con **Next.js 14 (App Router)** + **FastAPI** + **Supabase PostgreSQL**.

---

## 📁 Estructura del Proyecto

```text
/
├── /backend                    # API Python — FastAPI
│   ├── app/                    # Routers, modelos, esquemas, dependencias
│   ├── venv/                   # Entorno virtual Python (local)
│   ├── .env                    # Variables de entorno (DATABASE_URL, SECRET_KEY…)
│   ├── migrate.py              # Script de migraciones manuales
│   └── requirements.txt
├── /frontend                   # Aplicación Web — Next.js 14 App Router
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Login, Registro, Restablecimiento de contraseña
│   │   │   ├── admin/          # Vista Admin + /admin/profile (Perfil & Config)
│   │   │   ├── profesor/       # Vista Profesor + /profesor/profile (Perfil & Config)
│   │   │   └── dashboard/      # Vista Estudiante + /dashboard/profile (Perfil & Config)
│   │   ├── components/
│   │   │   ├── ProtectedRoute.tsx   # Guard de rutas por rol
│   │   │   └── UserNav.tsx          # Menú desplegable de usuario (Perfil + Cerrar sesión)
│   │   ├── hooks/
│   │   │   └── useAuth.ts          # Estado de sesión + timeout de inactividad (5 min)
│   │   └── lib/
│   │       └── api.ts              # Cliente centralizado para llamadas al backend
│   └── .env.local              # NEXT_PUBLIC_API_URL
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
| `/dashboard` | 🎓 Estudiante | Panel principal del estudiante |
| `/dashboard/profile` | 🎓 Estudiante | Perfil + Configuración (Académico, Progreso, Seguridad) |
| `/dashboard/prueba-simulada` | 🎓 Estudiante | Prueba simulada tipo Saber Pro |
| `/dashboard/tutor-ia` | 🎓 Estudiante | Chat con Tutor de IA |
| `/dashboard/resultados` | 🎓 Estudiante | Resultados históricos |
| `/profesor` | 👨‍🏫 Profesor | Panel principal del docente |
| `/profesor/profile` | 👨‍🏫 Profesor | Perfil + Configuración (Materias, Cuenta, Académicas) |
| `/admin` | 🛡️ Admin | Panel principal del administrador |
| `/admin/profile` | 🛡️ Admin | Perfil + Configuración (Accesos, Plataforma, Seguridad, Notif.) |

---

## 🔐 Autenticación y Roles (RBAC)

El sistema implementa control de acceso basado en roles con JWT.

| Rol | Acceso |
|-----|--------|
| **Estudiante** | Pruebas simuladas, Tutor IA, resultados propios |
| **Profesor** | Analítica de grupos, gestión de contenidos y materias |
| **Administrador** | Control total: usuarios, códigos de docente, configuración de plataforma |

**Flujos clave:**
- El **login** lee el rol del JWT y redirige automáticamente a la vista correspondiente.
- `ProtectedRoute.tsx` bloquea el acceso a rutas de otros roles y redirige al dashboard correcto.
- El **timeout de inactividad** (5 minutos) cierra la sesión automáticamente si el usuario no interactúa.
- Los **Códigos de Registro de Docente** se generan desde `/admin/profile` → pestaña *Accesos*. Tienen validez de 30 días y son de un solo uso.

---

## 🎨 Diseño y UI

- **Framework de estilos:** Tailwind CSS + componentes de shadcn/ui.
- **Modo Oscuro:** Soporte completo con clases `dark:` en todos los componentes.
- **Layout de autenticación:** Split-screen (branding a la izquierda, formulario a la derecha).
  - Login → Azul (`blue-700`)
  - Registro → Esmeralda (`emerald-600`)
  - Restablecer contraseña → Violeta (`violet-700`)
- **Gráficas:** Recharts para evolución de puntajes y rendimiento por área (vista estudiante).
- **UserNav:** Menú desplegable en el header de todas las vistas con acceso a Perfil/Config y Cerrar sesión.

---

## 🧩 API Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/register` | Registro de estudiante (libre) |
| `POST` | `/auth/register/teacher` | Registro docente (requiere código válido) |
| `POST` | `/auth/login` | Login — retorna JWT con rol |
| `POST` | `/auth/reset-password` | Solicitar recuperación de contraseña |
| `GET` | `/users/me` | Info del usuario autenticado |
| `GET` | `/admin/teacher-codes` | Lista de códigos (solo Admin) |
| `GET` | `/health` | Estado del servidor |

---

## 📝 Notas Técnicas

- **JWT Claims:** El payload incluye el rol del usuario; el frontend lo usa para redirigir y el backend para autorizar endpoints con `Depends(require_role)`.
- **Códigos de Docente:** Se invalidan automáticamente al ser usados (transacción única en BD).
- **Cliente API centralizado:** `src/lib/api.ts` añade el Bearer Token a todas las peticiones post-login.
- **Migraciones:** Si se agregan columnas al modelo de BD, ejecutar `python migrate.py` desde el backend.

---

## 👥 Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | `admin@siproudc.com` | `admin1234` |
| Profesor | `julioprofe@iudc.com` | `julioprofe123.` |
| Estudiante | `ryanhdez27@iudc.com` | `ryan123.` |