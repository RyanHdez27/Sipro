// Centralized API client utility for SIPRO frontend
// All fetch calls to the backend should use this helper

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function getApiErrorMessage(res: Response, fallback: string) {
  try {
    const payload = await res.json();
    if (typeof payload?.detail === "string" && payload.detail.trim()) return payload.detail;
    if (typeof payload?.message === "string" && payload.message.trim()) return payload.message;
    if (typeof payload?.error?.message === "string" && payload.error.message.trim()) return payload.error.message;
  } catch {
    // Ignorar errores de parseo y usar fallback.
  }

  if (res.status === 429) return "Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.";
  if (res.status === 404) return "Recurso no encontrado. Verifica que el backend esté actualizado.";
  return fallback;
}

export interface CurrentUser {
  id: number;
  name: string;
  email: string;
  role: "estudiante" | "profesor" | "admin";
  is_active: boolean;
  wants_newsletter: boolean;
  phone?: string | null;
  avatar_url?: string | null;
}

export interface LoginResponse {
  access_token?: string;
  token_type?: string;
  requires_2fa?: boolean;
  otp_token?: string;
  message?: string;
  expires_in_seconds?: number;
}

export interface UserProfile {
  user_id: number;
  career?: string | null;
  university?: string | null;
  semester?: string | null;
  objective_score?: number | null;
  practice_frequency?: string | null;
  preferred_difficulty?: string | null;
  updated_at?: string | null;
}

export interface UserSecurity {
  two_factor_enabled: boolean;
}

export interface ActiveSession {
  session_id: string;
  ip?: string | null;
  user_agent?: string | null;
  created_at: string;
  last_seen_at?: string | null;
  expires_at: string;
  is_current: boolean;
}

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
  return res.json() as Promise<LoginResponse>;
}

export async function verifyTwoFactorLogin(otpToken: string, otpCode: string) {
  const res = await fetch(`${API_BASE}/auth/login/2fa/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp_token: otpToken, otp_code: otpCode }),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudo verificar el codigo OTP"));
  }
  return res.json() as Promise<{ access_token: string; token_type: string }>;
}

export async function resendTwoFactorLoginCode(otpToken: string) {
  const res = await fetch(`${API_BASE}/auth/login/2fa/resend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otp_token: otpToken }),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudo reenviar el codigo OTP"));
  }
  return res.json() as Promise<LoginResponse>;
}

/** GET /users/me — returns the current authenticated user */
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const fallback = res.status === 401 ? "Sesión expirada" : "No se pudo cargar el usuario actual";
    throw new Error(await getApiErrorMessage(res, fallback));
  }
  return res.json() as Promise<CurrentUser>;
}

/** PUT /users/me — update current user data */
export async function updateCurrentUser(data: {
  name?: string;
  email?: string;
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
    throw new Error(await getApiErrorMessage(res, "Error al actualizar perfil"));
  }
  return res.json();
}

/** GET /users/me/profile — student profile preferences */
export async function getCurrentUserProfile() {
  const res = await fetch(`${API_BASE}/users/me/profile`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const fallback = res.status === 404
      ? "El endpoint /users/me/profile no existe en el backend activo. Reinicia el backend con los últimos cambios."
      : "No se pudo cargar el perfil académico";
    throw new Error(await getApiErrorMessage(res, fallback));
  }
  return res.json() as Promise<UserProfile>;
}

/** PUT /users/me/profile — update student profile preferences */
export async function updateCurrentUserProfile(data: {
  career?: string;
  university?: string;
  semester?: string;
  objective_score?: number;
  practice_frequency?: string;
  preferred_difficulty?: string;
}) {
  const res = await fetch(`${API_BASE}/users/me/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "Error al actualizar el perfil académico"));
  }
  return res.json() as Promise<UserProfile>;
}

export async function getCurrentUserSecurity() {
  const res = await fetch(`${API_BASE}/users/me/security`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudo cargar la configuracion de seguridad"));
  }
  return res.json() as Promise<UserSecurity>;
}

export async function updateCurrentUserSecurity(data: UserSecurity) {
  const res = await fetch(`${API_BASE}/users/me/security`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...authHeader(),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudo actualizar la configuracion de seguridad"));
  }
  return res.json() as Promise<UserSecurity>;
}

export async function getActiveSessions() {
  const res = await fetch(`${API_BASE}/users/me/sessions`, {
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudieron cargar las sesiones activas"));
  }
  return res.json() as Promise<ActiveSession[]>;
}

export async function revokeSession(sessionId: string) {
  const res = await fetch(`${API_BASE}/users/me/sessions/${sessionId}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudo cerrar la sesion seleccionada"));
  }
  return res.json() as Promise<{ revoked: boolean; revoked_session_id: string; was_current: boolean }>;
}

export async function revokeAllSessions() {
  const res = await fetch(`${API_BASE}/users/me/sessions`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    throw new Error(await getApiErrorMessage(res, "No se pudieron cerrar las sesiones activas"));
  }
  return res.json() as Promise<{ revoked_count: number; current_session_revoked: boolean }>;
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
