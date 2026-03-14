# SIPRO UDC - Arquitectura MVP

Este repositorio contiene la arquitectura MVP Full-Stack para el proyecto SIPRO UDC, migrando de una exportación estática de Figma Vite a un Monorepo listo para producción.

## Estructura del Proyecto

```text
/
├── /backend            # Aplicación Python FastAPI
│   ├── app/            # Código fuente (routers, modelos, esquemas)
│   ├── .env            # Configuración de Entorno
│   └── requirements.txt
├── /frontend           # Aplicación Web Next.js 14
│   ├── src/app/        # Endpoints del App Router de Next.js (Auth, Dashboard, etc)
│   ├── src/components/ # Componentes de Interfaz Compartidos & Rutas Protegidas
│   └── src/pages_old/  # Vistas Legacy de Figma enrutadas a Next.js
├── README.md           # Instrucciones de Instalación
```

## 1. Configuración de Base de Datos
1. Instala PostgreSQL y realiza la configuración local.
2. Crea una base de datos llamada `sipro_db`.
3. Las tablas de la base de datos se crean automáticamente en la primera ejecución de FastAPI. *(Actualmente usando SQLite `sipro_db.db` por defecto si PostgreSQL no está activo, para pruebas locales fluidas)*.

## 2. Configuración del Backend (FastAPI)

1. Navega a la carpeta backend:
   ```bash
   cd backend
   ```
2. Crea un entorno virtual (Python 3.12+):
   ```bash
   python -m venv venv
   ```
   * Activar (Windows): `venv\Scripts\activate`
   * Activar (Mac/Linux): `source venv/bin/activate`
3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
4. Inicia el servidor:
   ```bash
   uvicorn app.main:app --reload
   ```
   > La API estará disponible en http://localhost:8000
   > Puedes ver la documentación automática de endpoints en http://localhost:8000/docs

## 3. Configuración del Frontend (Next.js 14)

1. Navega a la carpeta frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias (mapeadas desde Tailwind v4 & Vite UI):
   ```bash
   npm install
   ```
3. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   > La aplicación web estará disponible en http://localhost:3000
   > La ruta base `/` redirige automáticamente al `/dashboard` Protegido, requiriendo inicio de sesión.

## Flujos de Autenticación y Perfil

- **Iniciar Sesión**: Manejado de forma segura vía POST `/auth/login` retornando un Token JWT verificable.
- **Registro y Boletín**: Almacena contraseñas hasheadas usando Bcrypt vía POST `/auth/register`. Incluye registro de preferencia para correos promocionales.
- **Rutas Protegidas**: Manejadas mediante un componente envoltorio en el Cliente Next.js verificando tokens de `localStorage`.
- **Menú de Perfil (`/dashboard/profile`)**: Menú desplegable dinámico para editar nombre, contraseña y preferencias.
- **Modo de Pruebas (Bypass Dev)**: Las rutas `/dashboard` y `/dashboard/profile` están temporalmente habilitadas para acceso directo sin inicio de sesión con datos simulados (mock data) para facilitar la prueba de componentes UI.

*Nota: Las interfaces Typescript autogeneradas por Figma tienen sus revisiones estrictas deshabilitadas en la construcción de Next.js mediante `next.config.mjs` para asegurar iteraciones rápidas manteniendo el soporte estándar del App Router.*