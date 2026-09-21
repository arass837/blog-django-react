import api from '../api';

export const fetchPosts = () => api.get('posts/');
export const fetchPostBySlug = (slug) => api.get(`posts/${slug}/`);
export const createPost = (data) => api.post('posts/', data);
export const updatePost = (slug, data) => api.put(`posts/${slug}/`, data);
export const deletePost = (slug) => api.delete(`posts/${slug}/`);
