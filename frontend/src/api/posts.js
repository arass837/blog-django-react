import api from '../api';

export const fetchPosts = () => api.get('posts/');
export const createPost = (data) => api.post('posts/', data);
export const fetchPostById = (id) => api.get(`posts/${id}/`);
export const updatePost = (id, data) => api.put(`posts/${id}/`, data);
export const deletePost = (id) => api.delete(`posts/${id}/`);
