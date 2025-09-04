import api from '../client';

// Transactions services
export async function getTransactions(page = 1, limit = 10) {
  const { data } = await api.get(`/admin/transactions?page=${page}&limit=${limit}`);
  return data;
}

export async function refundTransaction(id) {
  const { data } = await api.post(`/admin/transactions/${id}/refund`);
  return data;
}

export async function validatePayment(id) {
  const { data } = await api.post(`/admin/transactions/${id}/validate-payment`);
  return data;
}
