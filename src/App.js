import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import '@fontsource/montserrat/300.css';
import '@fontsource/montserrat/400.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import Users from './pages/Users/Users';
import Teachers from './pages/Teachers/Teachers';
import Transactions from './pages/Transactions/Transactions';
import Login from './pages/Login/Login';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0B442D',
      light: '#2D6B4F',
      dark: '#051F16',
      contrastText: '#F9FBF9',
    },
    secondary: {
      main: '#FAB73C',
      light: '#FCC866',
      dark: '#E09B1A',
      contrastText: '#0B442D',
    },
    tertiary: {
      main: '#EC681C',
      light: '#F08A4A',
      dark: '#C54D0F',
      contrastText: '#F9FBF9',
    },
    // Couleurs neutres pour améliorer la visibilité
    neutral: {
      white: '#FFFFFF',
      black: '#000000',
      lightGray: '#F5F5F5',
      darkGray: '#333333',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
      secondary: '#F8F9FA',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#6B7280',
      disabled: '#9CA3AF',
    },
    divider: 'rgba(11, 68, 45, 0.12)',
    success: {
      main: '#0B442D',
      light: '#2D6B4F',
      dark: '#051F16',
      contrastText: '#F9FBF9',
    },
    warning: {
      main: '#FAB73C',
      light: '#FCC866',
      dark: '#E09B1A',
      contrastText: '#0B442D',
    },
    error: {
      main: '#EC681C',
      light: '#F08A4A',
      dark: '#C54D0F',
      contrastText: '#F9FBF9',
    },
    info: {
      main: '#2D6B4F',
      light: '#4A8B6B',
      dark: '#1A4A35',
      contrastText: '#F9FBF9',
    },
  },
  typography: {
    fontFamily: '"Inter", "Montserrat", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: '"AmpleSoft Pro", sans-serif',
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      color: '#0B442D',
      letterSpacing: '-0.02em',
    },
    h4: {
      fontFamily: '"AmpleSoft Pro", sans-serif',
      fontWeight: 700,
      fontSize: '1.875rem',
      lineHeight: 1.3,
      color: '#1A1A1A',
      letterSpacing: '-0.01em',
    },
    h5: {
      fontFamily: '"AmpleSoft Pro", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      color: '#1A1A1A',
      letterSpacing: '-0.01em',
    },
    h6: {
      fontFamily: '"AmpleSoft Pro", sans-serif',
      fontWeight: 600,
      fontSize: '1.125rem',
      color: '#1A1A1A',
      letterSpacing: '-0.005em',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#374151',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.8125rem',
      lineHeight: 1.5,
      color: '#6B7280',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.4,
      color: '#9CA3AF',
      fontWeight: 400,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          border: '1px solid #E5E7EB',
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          fontFamily: '"Inter", sans-serif',
          padding: '8px 16px',
          fontSize: '0.875rem',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        contained: {
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: 1,
          '&:hover': {
            borderWidth: 1,
            backgroundColor: 'rgba(11, 68, 45, 0.04)',
          },
        },
        large: {
          padding: '12px 24px',
          fontSize: '1rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: '0.75rem',
          fontFamily: '"Montserrat", sans-serif',
          fontWeight: 600,
          height: 28,
        },
        colorSuccess: {
          backgroundColor: 'rgba(11, 68, 45, 0.1)',
          color: '#0B442D',
        },
        colorWarning: {
          backgroundColor: 'rgba(250, 183, 60, 0.15)',
          color: '#E09B1A',
        },
        colorError: {
          backgroundColor: 'rgba(236, 104, 28, 0.15)',
          color: '#C54D0F',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#0B442D',
          boxShadow: '0 1px 3px 0 rgba(11, 68, 45, 0.1), 0 1px 2px 0 rgba(11, 68, 45, 0.06)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid rgba(11, 68, 45, 0.12)',
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(11, 68, 45, 0.1)',
          border: '1px solid rgba(11, 68, 45, 0.08)',
          borderRadius: '12px !important',
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '8px 0',
          },
        },
      },
    },
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(11, 68, 45, 0.12)',
          borderRadius: 16,
          '& .MuiDataGrid-cell': {
            borderColor: 'rgba(11, 68, 45, 0.08)',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'rgba(11, 68, 45, 0.04)',
            borderColor: 'rgba(11, 68, 45, 0.12)',
          },
        },
      },
    },
  },
});

function App() {
  const RequireAuth = ({ children }) => {
    const token = localStorage.getItem('eps_auth_token') || sessionStorage.getItem('eps_auth_token');
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes wrapped with Layout */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="teachers" element={<Teachers />} />
            <Route path="transactions" element={<Transactions />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
