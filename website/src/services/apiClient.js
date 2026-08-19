// Public API Client for Website (No Admin auth header required)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const publicFetch = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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
