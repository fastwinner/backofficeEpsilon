import api from '../client';

// Users services
export async function getUsers(page = 1, limit = 10) {
  const { data } = await api.get(`/admin/eleves?page=${page}&limit=${limit}`);
  return data;
}

export async function getUser(id) {
  const { data } = await api.get(`/admin/eleves/${id}`);
  return data;
}

export async function createUser(userData) {
  const { data } = await api.post('/admin/eleves', userData);
  return data;
}

export async function updateUser(id, userData) {
  const { data } = await api.put(`/admin/eleves/${id}`, userData);
  return data;
}

export async function deleteUser(id) {
  const { data } = await api.delete(`/admin/eleves/${id}`);
  return data;
}
