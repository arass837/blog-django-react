
// =============================================================================================
import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const fetchPosts = () => API.get('/posts/');
export const fetchPostById = (slug) => API.get(`/posts/${slug}/`);

export const createPost = (data, token) =>
  API.post('/posts/', data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updatePost = (slug, data, token) =>
  API.put(`/posts/${slug}/`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deletePost = (slug, token) =>
  API.delete(`/posts/${slug}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const postToken = (data) => API.post('/token/', data);

// ==============================================================
export const incrementViews = () => API.post("/views/increment/");