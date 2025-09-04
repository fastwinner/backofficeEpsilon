import api from '../client';

// Helper function to check if user has admin role
function isAdmin(user) {
  // Check if user has admin role
  if (user.role === 'admin') return true;
  
  // Check in roles array if it exists
  if (user.roles && Array.isArray(user.roles)) {
    return user.roles.some(role => 
      role.name === 'admin' || role.name === 'administrateur'
    );
  }
  
  return false;
}

// Login endpoint - returns { access_token, token_type, user }
export async function login(email, password) {
  const { data } = await api.post('/auth/login', { email, password });
  
  // Check if user is admin
  if (!isAdmin(data.user)) {
    throw new Error('Accès refusé. Seuls les administrateurs peuvent accéder au back office.');
  }
  
  // Response: { access_token: string, token_type: "Bearer", user: object }
  return {
    token: data.access_token,
    user: data.user,
    tokenType: data.token_type
  };
}
