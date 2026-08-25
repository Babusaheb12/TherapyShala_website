// Public API Client for Website (No Admin auth header required)
const getApiBaseUrl = () => {
  // In local development, route through Vite proxy (/api/v1) to bypass browser CORS origin restrictions
  if (import.meta.env.DEV) {
    return '/api/v1';
  }
  let url = (import.meta.env.VITE_API_BASE_URL || '/api/v1').trim();
  url = url.replace(/\/+$/, '');
  if (!url.endsWith('/api/v1') && !url.includes('/api/v1')) {
    url = `${url}/api/v1`;
  }
  return url;
};

export const publicFetch = async (endpoint, options = {}) => {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${base}${cleanEndpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(json?.error?.message || json?.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = json;
    throw error;
  }

  return json;
};

export default publicFetch;
