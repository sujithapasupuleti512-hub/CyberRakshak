// Central API client. Uses a relative base URL by default so that:
//  - local dev  -> Vite proxy forwards /api to http://127.0.0.1:8000
//  - production -> Vercel rewrites /api to the deployed FastAPI backend
// VITE_API_URL can override the base URL if the backend lives elsewhere.

const RAW_BASE = import.meta.env.VITE_API_URL || "";
const API_BASE = RAW_BASE.replace(/\/$/, "");

async function request(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Please check your connection and try again.");
  }

  if (response.status === 204) return null;

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data && data.detail;
    let message = "Something went wrong. Please try again.";
    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail) && detail.length) {
      message = detail.map((item) => item.msg || "").filter(Boolean).join(", ") || message;
    }
    throw new Error(message);
  }

  return data;
}

export const api = {
  health: () => request("/api/health"),
  register: ({ name, email, password }) =>
    request("/api/auth/register", { method: "POST", body: { name, email, password } }),
  login: ({ email, password }) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  getMe: (token) => request("/api/auth/me", { token }),
  scanUrl: (target, token) =>
    request("/api/scan/url", { method: "POST", body: { target }, token }),
  scanDomain: (target, token) =>
    request("/api/scan/domain", { method: "POST", body: { target }, token }),
  getScans: (token) => request("/api/scans", { token }),
  clearScans: (token) => request("/api/scans", { method: "DELETE", token }),
  getDashboardStats: (token) => request("/api/dashboard/stats", { token }),
};
