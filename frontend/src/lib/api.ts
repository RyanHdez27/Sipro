// Centralized API client utility for SIPRO frontend
// All fetch calls to the backend should use this helper

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/** Build Authorization header from localStorage token */
export function authHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** POST /auth/register */
export async function registerUser(data: { name: string; email: string; password: string; wants_newsletter: boolean; carrera?: string }) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error en el registro");
  }
  return res.json();
}

/** POST /auth/register/teacher */
export async function registerTeacher(data: {
  name: string;
  email: string;
  password: string;
  wants_newsletter: boolean;
  teacher_code: string;
}) {
  const res = await fetch(`${API_BASE}/auth/register/teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error en el registro de profesor");
  }
  return res.json();
}

/** POST /auth/login  — returns { access_token, token_type } */
export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });
  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

/** GET /users/me — returns the current authenticated user */
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Session expired");
  return res.json();
}

/** PUT /users/me — update current user data */
export async function updateCurrentUser(data: {
  name?: string;
  phone?: string;
  avatar_url?: string;
  wants_newsletter?: boolean;
  password?: string;
}) {
  const res = await fetch(`${API_BASE}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error al actualizar perfil");
  }
  return res.json();
}

/** GET /admin/stats — admin dashboard statistics */
export async function getAdminStats() {
  const res = await fetch(`${API_BASE}/admin/stats`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json() as Promise<{
    total_estudiantes: number;
    total_docentes: number;
    docentes: { id: number; name: string; email: string; is_active: boolean }[];
    estudiantes: { id: number; name: string; email: string; is_active: boolean; carrera: string | null }[];
  }>;
}

/** POST /admin/codes — generate a new teacher code */
export async function generateTeacherCode() {
  const res = await fetch(`${API_BASE}/admin/codes`, {
    method: "POST",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error generando código");
  return res.json();
}

/** GET /admin/codes — list all teacher codes */
export async function getTeacherCodes() {
  const res = await fetch(`${API_BASE}/admin/codes`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error obteniendo códigos");
  return res.json() as Promise<
    { code: string; created_at: string; expires_at: string; estado: string; used_by_name: string | null }[]
  >;
}

/** DELETE /admin/codes/:code — revoke a teacher code */
export async function revokeTeacherCode(code: string) {
  const res = await fetch(`${API_BASE}/admin/codes/${code}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error revocando código");
  return res.json();
}

/** POST /admin/register-teacher — admin registers a teacher manually */
export async function adminRegisterTeacher(data: { name: string; email: string; password: string }) {
  const res = await fetch(`${API_BASE}/admin/register-teacher`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error registrando docente");
  }
  return res.json();
}

/** GET /admin/login-logs — get recent login logs */
export async function getLoginLogs() {
  const res = await fetch(`${API_BASE}/admin/login-logs`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error obteniendo logs");
  return res.json() as Promise<
    { id: number; user_email: string; action: string; ip: string; user_agent: string; success: boolean; created_at: string }[]
  >;
}

/** DELETE /admin/login-logs — clear all login logs */
export async function clearLoginLogs() {
  const res = await fetch(`${API_BASE}/admin/login-logs`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Error limpiando logs");
  return res.json();
}

/** GET /profesor/stats — professor dashboard statistics */
export async function getProfesorStats() {
  const res = await fetch(`${API_BASE}/profesor/stats`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) throw new Error("Failed to fetch profesor stats");
  return res.json() as Promise<{
    total_estudiantes: number;
    total_docentes: number;
    distribucion_carreras: { carrera: string; cantidad: number }[];
    estudiantes: { id: number; name: string; email: string; is_active: boolean; carrera: string | null }[];
  }>;
}
