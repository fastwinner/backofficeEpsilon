import api from '../client';

// Fetch dashboard stats and charts
export async function getDashboardStats() {
  const [statsResponse, chartsResponse] = await Promise.all([
    api.get('/admin/stats'),
    api.get('/admin/charts')
  ]);
  
  const stats = statsResponse.data;
  const charts = chartsResponse.data;
  
  // Combine both responses into the format expected by Dashboard component
  return {
    ...stats,
    ...charts
  };
}
