
// =============================================================================================
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const fetchPosts = () => API.get('/posts/');
export const fetchPostById = (id) => API.get(`/posts/${id}/`);

export const createPost = (data, token) =>
  API.post('/posts/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (id, data, token) =>
  API.put(`/posts/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePost = (id, token) =>
  API.delete(`/posts/${id}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postToken = (data) => API.post('/token/', data);

// ==============================================================
export const incrementViews = () => API.post("/views/increment/");