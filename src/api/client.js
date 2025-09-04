import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

// Helper to read token from storage
function getToken() {
  const ls = typeof window !== 'undefined' ? window.localStorage : null;
  const ss = typeof window !== 'undefined' ? window.sessionStorage : null;
  return (ls && ls.getItem('eps_auth_token')) || (ss && ss.getItem('eps_auth_token')) || null;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token and admin key to every request
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.REACT_APP_ADMIN_KEY) {
      config.headers['X-Admin-Key'] = process.env.REACT_APP_ADMIN_KEY;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optionally handle 401 to redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      // Token invalid/expired: clear and redirect to login
      try {
        window.localStorage.removeItem('eps_auth_token');
        window.sessionStorage.removeItem('eps_auth_token');
      } catch {}
      // Let the app decide navigation; do not redirect forcibly here
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
