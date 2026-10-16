// Vite embeds this value at build time. Keep the production URL as a fallback so
// a deployment without an injected environment variable never points at ngrok.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://api.therapyshala.com/api/v1";

export const getApiBaseUrl = () => {
  // In browser on localhost / DEV, route via Vite proxy (/api/v1) to prevent backend CORS origin denials
  if (
    typeof window !== "undefined" &&
    (import.meta.env.DEV ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  ) {
    return "/api/v1";
  }

  let url = API_BASE_URL.trim();
  url = url.replace(/\/+$/, "");
  if (!url.endsWith("/api/v1") && !url.includes("/api/v1")) {
    url = `${url}/api/v1`;
  }
  return url;
};

export const OWNER_TOKEN_KEY = "therapyshala_owner_token";

/**
 * Universal fetch client with automatic bearer token attachment for authenticated endpoints
 * Includes automatic retry for temporary 502 Bad Gateway / network connection drops
 */
export const apiClient = async (endpoint, options = {}, retries = 2) => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${cleanEndpoint}`;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers = {
    Accept: "application/json",
    ...options.headers,
  };

  // Only set Content-Type: application/json if not sending FormData
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  // Attach Owner or Admin Bearer Token if available and not explicitly overridden
  const token =
    localStorage.getItem(OWNER_TOKEN_KEY) ||
    localStorage.getItem("therapyshala_owner_token") ||
    localStorage.getItem("therapyshala_admin_token") ||
    localStorage.getItem("token");
  if (token && !headers["Authorization"] && !options.skipAuth) {
    headers["Authorization"] = `Bearer ${token.trim()}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (netErr) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return apiClient(endpoint, options, retries - 1);
    }
    throw netErr;
  }

  // Auto-retry once ONLY if proxy returns temporary 502/503/504 gateway resets (NEVER retry 429)
  if (
    (response.status === 502 ||
      response.status === 503 ||
      response.status === 504) &&
    retries > 0
  ) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return apiClient(endpoint, options, retries - 1);
  }

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg =
      json?.error?.message ||
      json?.message ||
      `Request failed with status ${response.status}`;

    const error = new Error(errorMsg);
    error.status = response.status;
    error.code = json?.error?.code || json?.code;
    error.data = json;

    if (
      response.status === 401 &&
      !options.skipAuth &&
      !endpoint.includes("/login")
    ) {
      // Trigger session expiry event
      window.dispatchEvent(new CustomEvent("owner:unauthorized"));
    }

    throw error;
  }

  return json;
};

export const publicFetch = apiClient;

export default apiClient;
