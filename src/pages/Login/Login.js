import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import EpsilonLogo from '../../components/EpsilonLogo';
import { login as loginRequest } from '../../api/services/auth';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('jean.dupont@example.com');
  const [password, setPassword] = useState('password123');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  // Force pre-fill after mount to avoid browser password manager overriding initial values
  useEffect(() => {
    setEmail('jean.dupont@example.com');
    setPassword('password123');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Veuillez saisir votre email et votre mot de passe');
      return;
    }
    try {
      const data = await loginRequest(email, password);
      const token = data?.token;
      if (!token) {
        setError("Authentification échouée: jeton manquant.");
        return;
      }
      if (remember) {
        localStorage.setItem('eps_auth_token', token);
      } else {
        sessionStorage.setItem('eps_auth_token', token);
      }
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Une erreur s'est produite. Veuillez réessayer.";
      setError(msg);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: 'linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%)', 
      p: 2 
    }}>
      <Card sx={{ 
        width: '100%', 
        maxWidth: 440, 
        borderRadius: 3,
        border: '1px solid #E5E7EB',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
      }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, mb: 4 }}>
            <EpsilonLogo width={160} height={48} />
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 1 }}>Epsilon Admin</Typography>
              <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1rem' }}>Connectez-vous à votre espace d'administration</Typography>
            </Box>
          </Box>

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0B442D',
                  },
                },
              }}
            />
            <TextField
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0B442D',
                  },
                },
              }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={remember} 
                  onChange={(e) => setRemember(e.target.checked)}
                  sx={{
                    color: '#6B7280',
                    '&.Mui-checked': {
                      color: '#0B442D',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: '#374151', fontWeight: 500 }}>
                  Se souvenir de moi
                </Typography>
              }
            />
            {error && (
              <Box sx={{ p: 2, bgcolor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
                <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: 500 }}>{error}</Typography>
              </Box>
            )}
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              sx={{
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 4px 6px -1px rgba(11, 68, 45, 0.3)',
                '&:hover': {
                  boxShadow: '0 10px 15px -3px rgba(11, 68, 45, 0.4)',
                },
              }}
            >
              Se connecter
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Login;
