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
export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  wants_newsletter: boolean;
}) {
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
