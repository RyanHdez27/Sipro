# SIPRO UDC - Arquitectura MVP

Sistema Integral de Preparación para el Saber Pro - UDC. Aplicación Full-Stack para el aprendizaje adaptativo con Tutor de IA.

## Estructura del Proyecto

```text
/
├── /backend            # Aplicación Python FastAPI
│   ├── app/            # Código fuente (routers, modelos, esquemas)
│   ├── venv/           # Entorno virtual Python (generado localmente)
│   ├── .env            # Configuración de Entorno (DATABASE_URL, SECRET_KEY, etc.)
│   ├── migrate.py      # Script para migraciones de columnas en BD
│   └── requirements.txt
├── /frontend           # Aplicación Web Next.js 14
│   ├── src/app/        # Endpoints del App Router (Auth, Dashboard, Perfil, etc.)
│   ├── src/components/ # Componentes Compartidos (UserNav, ProtectedRoute)
│   ├── src/lib/        # Librería cliente API (api.ts)
│   ├── src/pages_old/  # Vistas legacy de Figma enrutadas a Next.js
│   └── .env.local      # Variables de entorno del frontend (NEXT_PUBLIC_API_URL)
└── README.md
```

## 1. Base de Datos (Supabase PostgreSQL)

El proyecto utiliza **PostgreSQL alojado en Supabase**. La conexión se configura directamente en el archivo `.env` del backend.

1. Abre el archivo `backend/.env` y actualiza la variable `DATABASE_URL` con tu cadena de conexión de Supabase:
   ```env
   DATABASE_URL=postgresql+psycopg://usuario:contraseña@host:5432/postgres
   SECRET_KEY=tu_clave_secreta_larga_aqui
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```
2. Las tablas (`users`) se crean automáticamente al iniciar el servidor por primera vez.
3. Si agregas nuevas columnas al modelo, ejecuta la migración:
   ```bash
   .\venv\Scripts\python migrate.py
   ```

## 2. Configuración del Backend (FastAPI)

**Requisito:** Python 3.11 o 3.12 (preferido). Python 3.13 puede generar conflictos con SQLAlchemy antiguo.

```bash
cd backend

# 1. Crear entorno virtual (solo la primera vez)
python -m venv venv

# 2. Activar el entorno virtual
.\venv\Scripts\activate          # Windows PowerShell
# source venv/bin/activate       # Mac / Linux

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Iniciar el servidor
.\venv\Scripts\uvicorn app.main:app --reload
```

> La API estará disponible en **http://localhost:8000**  
> Documentación interactiva (Swagger UI): **http://localhost:8000/docs**

> ⚠️ **Importante:** Siempre inicia el servidor usando `.\venv\Scripts\uvicorn` (no el `uvicorn` global del sistema) para evitar conflictos de versiones de librerías.

## 3. Configuración del Frontend (Next.js 14)

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (ya incluidas en .env.local)
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Iniciar el servidor de desarrollo
npm run dev
```

> La aplicación estará disponible en **http://localhost:3000**  
> La ruta `/` redirige automáticamente al `/dashboard`. Sin sesión iniciada, te enviará a `/auth/login`.

## 4. Flujos Implementados

### Autenticación
- **Registro** (`/auth/register`): Crea una cuenta con nombre, email, contraseña y preferencia de newsletter. Contraseña almacenada con hash Bcrypt.
- **Login** (`/auth/login`): Devuelve un token JWT guardado en `localStorage`.
- **Rutas Protegidas**: El componente `ProtectedRoute` verifica el JWT. Sin token válido, redirige a `/auth/login`.

### Módulos de la Aplicación
| Ruta | Descripción |
|------|-------------|
| `/dashboard` | Panel principal con accesos a todas las funciones |
| `/dashboard/profile` | Perfil del usuario — editar nombre, teléfono, avatar |
| `/dashboard/settings` | Configuración — notificaciones, privacidad, apariencia |
| `/dashboard/prueba-simulada` | Prueba simulada tipo Saber Pro con cronómetro |
| `/dashboard/resultados` | Resultados detallados de las pruebas realizadas |
| `/dashboard/tutor-ia` | Chat con Tutor de IA personalizado |
| `/dashboard/test-recuperacion` | Test adaptativo generado según áreas débiles |

### API Endpoints Backend
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/register` | Registro de usuario |
| POST | `/auth/login` | Login — retorna JWT |
| GET | `/users/me` | Obtener datos del usuario autenticado |
| PUT | `/users/me` | Actualizar perfil (nombre, teléfono, avatar, contraseña) |
| GET | `/health` | Estado del servidor |

## 5. Notas Técnicas

- Las interfaces TypeScript generadas por Figma tienen revisiones estrictas deshabilitadas en `next.config.mjs` para acelerar iteraciones.
- Los componentes legacy en `src/pages_old/` se importan como componentes React estándar dentro de páginas del App Router (`app/dashboard/*/page.tsx`).
- La librería `src/lib/api.ts` centraliza todas las llamadas al backend con manejo de errores y cabeceras de autenticación.