import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  PeopleIcon,
  SchoolIcon,
  LocalOfferIcon,
  EventIcon,
  AccountBalanceWalletIcon,
  TrendingUpIcon
} from '@mui/icons-material';
import StatCard from '../../components/StatCard/StatCard';
import { getDashboardStats } from '../../api/services/dashboard';


function Dashboard() {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState({ monthlyStats: [], offerStatus: [], revenueData: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getDashboardStats();
        if (!mounted) return;
        setStats({
          totalUsers: data?.totalUsers ?? 0,
          totalTeachers: data?.totalTeachers ?? 0,
          totalOffers: data?.totalOffers ?? 0,
          activeOffers: data?.activeOffers ?? 0,
          completedOffers: data?.completedOffers ?? 0,
          paidSessions: data?.paidSessions ?? 0,
          globalBalance: data?.globalBalance ?? 0,
          globalProfit: data?.globalProfit ?? 0,
          trends: data?.trends ?? {},
        });
        setChartData({
          monthlyStats: Array.isArray(data?.monthlyStats) ? data.monthlyStats : [],
          offerStatus: Array.isArray(data?.offerStatus) ? data.offerStatus : [],
          revenueData: Array.isArray(data?.revenueData) ? data.revenueData : [],
        });
      } catch (err) {
        if (!mounted) return;
        const msg = err?.response?.data?.message || err?.message || 'Erreur de chargement du tableau de bord';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
        <Typography variant="h6">Chargement du tableau de bord…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 2 }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Box>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 2 }}>
          Vue d'ensemble
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1rem' }}>
          Tableau de bord avec les métriques clés de votre plateforme Epsilon
        </Typography>
      </Box>
      
      {/* Statistiques principales */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Élèves totaux"
            value={stats.totalUsers.toLocaleString()}
            icon={<PeopleIcon />}
            color="#0B442D"
            trend={stats.trends?.users}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Professeurs"
            value={stats.totalTeachers}
            icon={<SchoolIcon />}
            color="#2D6B4F"
            trend={stats.trends?.teachers}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Offres totales"
            value={stats.totalOffers}
            icon={<AssignmentIcon />}
            color="#FAB73C"
            trend={stats.trends?.offers}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Offres actives"
            value={stats.activeOffers}
            icon={<TrendingUpIcon />}
            color="#EC681C"
            trend={stats.trends?.offers}
          />
        </Grid>
      </Grid>

      {/* Statistiques secondaires */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Séances payées"
            value={stats.paidSessions.toLocaleString()}
            icon={<PaymentIcon />}
            color="#4A8B6B"
            trend={stats.trends?.sessions}
          />
        </Grid>
      </Grid>

      {/* Statistiques financières */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Balance globale"
            value={`${stats.globalBalance.toLocaleString('fr-FR')} FCFA`}
            icon={<BalanceIcon />}
            color="#EC681C"
            trend={stats.trends?.balance}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Bénéfice global"
            value={`${stats.globalProfit.toLocaleString('fr-FR')} FCFA`}
            icon={<TrendingUpIcon />}
            color="#FAB73C"
            trend={stats.trends?.profit}
          />
        </Grid>
      </Grid>

      {/* Graphiques */}
      <Grid container spacing={4}>
        {/* Évolution mensuelle */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 'fit-content', border: '1px solid #E5E7EB' }}>
            <CardHeader 
              title="Évolution mensuelle" 
              titleTypographyProps={{ 
                variant: 'h6', 
                fontWeight: 700,
                color: '#111827',
                fontSize: '1.125rem'
              }}
              sx={{ pb: 2, pt: 3, px: 3 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartData.monthlyStats} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(11, 68, 45, 0.1)" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#2D6B4F' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#2D6B4F' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid rgba(11, 68, 45, 0.12)',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(11, 68, 45, 0.1)'
                    }}
                  />
                  <Bar dataKey="users" fill="#0B442D" name="Élèves" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="teachers" fill="#2D6B4F" name="Professeurs" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="offers" fill="#FAB73C" name="Offres" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Statut des offres */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 'fit-content', border: '1px solid #E5E7EB' }}>
            <CardHeader 
              title="Statut des offres" 
              titleTypographyProps={{ 
                variant: 'h6', 
                fontWeight: 700,
                color: '#111827',
                fontSize: '1.125rem'
              }}
              sx={{ pb: 2, pt: 3, px: 3 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={chartData.offerStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.offerStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Revenus mensuels */}
        <Grid item xs={12}>
          <Card sx={{ border: '1px solid #E5E7EB' }}>
            <CardHeader 
              title="Évolution des revenus" 
              titleTypographyProps={{ 
                variant: 'h6', 
                fontWeight: 700,
                color: '#111827',
                fontSize: '1.125rem'
              }}
              sx={{ pb: 2, pt: 3, px: 3 }}
            />
            <CardContent sx={{ pt: 0 }}>
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData.revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} FCFA`, 'Revenus']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0B442D" 
                    strokeWidth={3}
                    dot={{ fill: '#0B442D', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: '#0B442D' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
