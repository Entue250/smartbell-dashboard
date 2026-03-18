// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
// });

// // Attach JWT token to every request automatically
// API.interceptors.request.use((config) => {
//   const token = Cookies.get('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Redirect to login if token expires
// API.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       Cookies.remove('token');
//       window.location.href = '/login';
//     }
//     return Promise.reject(err);
//   }
// );

// export default API;

// src/lib/api.js — Axios instance with JWT refresh interceptor
import axios from 'axios';
import Cookies from 'js-cookie';

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, try refresh before redirecting to login
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        const refreshToken = Cookies.get('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );
        Cookies.set('token', data.token, { expires: 1 / 24 }); // 1 hour
        err.config.headers.Authorization = `Bearer ${data.token}`;
        return API(err.config);
      } catch {
        Cookies.remove('token');
        Cookies.remove('refresh_token');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default API;