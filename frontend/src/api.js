import axios from 'axios';

const rawBaseUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api/';
const baseURL = rawBaseUrl.endsWith('/') ? rawBaseUrl : `${rawBaseUrl}/`;

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
