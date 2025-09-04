import api from '../client';

// Teachers services
export async function getTeachers(page = 1, limit = 10) {
  const { data } = await api.get(`/admin/professeurs?page=${page}&limit=${limit}`);
  return data;
}

export async function getTeacher(id) {
  const { data } = await api.get(`/admin/professeurs/${id}`);
  return data;
}

export async function createTeacher(teacherData) {
  const { data } = await api.post('/admin/professeurs', teacherData);
  return data;
}

export async function updateTeacher(id, teacherData) {
  const { data } = await api.put(`/admin/professeurs/${id}`, teacherData);
  return data;
}

export async function deleteTeacher(id) {
  const { data } = await api.delete(`/admin/professeurs/${id}`);
  return data;
}

// Get subjects list
export async function getSubjects() {
  const { data } = await api.get('/admin/subjects');
  return data;
}
