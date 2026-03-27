// import axios from 'axios';
// const api = axios.create({ baseURL: 'http://localhost:8000/api/' });
// export default api;


// import axios from "axios";

// Pobiera backend URL z .env
// const API_URL = process.env.REACT_APP_API_URL;

// export const fetchPosts = () => axios.get(API_URL);
// export const createPost = (data) => axios.post(API_URL, data);
// export const fetchPostById = (id) => axios.get(`${API_URL}/posts/${id}/`);
// export const updatePost = (id, data) => axios.put(`${API_URL}/posts/${id}/`, data);
// export const deletePost = (id) => axios.delete(`${API_URL}/posts/${id}/`);

// ===================================================================================================

// const API_URL = process.env.REACT_APP_API_URL;

// export const fetchPosts = () => axios.get(`${API_URL}/api/posts/`);
// export const fetchPostById = (id) => axios.get(`${API_URL}/api/posts/${id}/`);
// export const createPost = (data) => axios.post(`${API_URL}/api/posts/`, data);
// export const updatePost = (id, data) => axios.put(`${API_URL}/api/posts/${id}/`, data);
// export const deletePost = (id) => axios.delete(`${API_URL}/api/posts/${id}/`);

// // login
// export const postToken = (data) => axios.post(`${API_URL}/api/token/`, data);
// =========================================================================================

// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// // pobranie wszystkich postów
// export const fetchPosts = () => axios.get(`${API_URL}/api/posts/`);

// // pobranie pojedynczego posta po ID
// export const fetchPostById = (id) => axios.get(`${API_URL}/api/posts/${id}/`);

// // tworzenie posta (z tokenem JWT)
// export const createPost = (data, token) =>
//   axios.post(`${API_URL}/api/posts/`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// // aktualizacja posta (z tokenem JWT)
// export const updatePost = (id, data, token) =>
//   axios.put(`${API_URL}/api/posts/${id}/`, data, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// // usuwanie posta (z tokenem JWT)
// export const deletePost = (id, token) =>
//   axios.delete(`${API_URL}/api/posts/${id}/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

// // login / pobranie tokena
// export const postToken = (data) => axios.post(`${API_URL}/api/token/`, data);
// ===================================================================================================
import axios from 'axios';

// 🔥 NAJPROSTSZE I NAJPEWNIEJSZE
export const fetchPosts = () => axios.get('/api/posts/');
export const fetchPostById = (id) => axios.get(`/api/posts/${id}/`);

export const createPost = (data, token) =>
  axios.post('/api/posts/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (id, data, token) =>
  axios.put(`/api/posts/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePost = (id, token) =>
  axios.delete(`/api/posts/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postToken = (data) => axios.post('/api/token/', data);