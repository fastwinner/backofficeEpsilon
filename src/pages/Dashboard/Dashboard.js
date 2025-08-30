import React, { useState } from 'react';
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
  People as PeopleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon,
  Payment as PaymentIcon,
  AccountBalance as BalanceIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import StatCard from '../../components/StatCard/StatCard';


function Dashboard() {
  const [stats] = useState({
    totalUsers: 1250,
    totalTeachers: 89,
    totalOffers: 456,
    activeOffers: 123,
    completedOffers: 288,
    paidSessions: 2145,
    globalBalance: 45670.50,
    globalProfit: 12890.25,
  });

  const [chartData] = useState({
    monthlyStats: [
      { month: 'Jan', users: 100, teachers: 8, offers: 45 },
      { month: 'Fév', users: 120, teachers: 12, offers: 52 },
      { month: 'Mar', users: 140, teachers: 15, offers: 48 },
      { month: 'Avr', users: 180, teachers: 18, offers: 65 },
      { month: 'Mai', users: 220, teachers: 22, offers: 78 },
      { month: 'Juin', users: 250, teachers: 25, offers: 85 },
    ],
    offerStatus: [
      { name: 'En cours', value: 123, color: '#FAB73C' },
      { name: 'Terminées', value: 288, color: '#0B442D' },
      { name: 'Annulées', value: 45, color: '#EC681C' },
    ],
    revenueData: [
      { month: 'Jan', revenue: 3500 },
      { month: 'Fév', revenue: 4200 },
      { month: 'Mar', revenue: 3800 },
      { month: 'Avr', revenue: 5100 },
      { month: 'Mai', revenue: 6200 },
      { month: 'Juin', revenue: 7800 },
    ],
  });

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
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Utilisateurs totaux"
            value={stats.totalUsers.toLocaleString()}
            icon={<PeopleIcon />}
            color="#0B442D"
            trend={{ type: 'up', value: '+12%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Professeurs"
            value={stats.totalTeachers}
            icon={<SchoolIcon />}
            color="#2D6B4F"
            trend={{ type: 'up', value: '+5%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Offres totales"
            value={stats.totalOffers}
            icon={<AssignmentIcon />}
            color="#FAB73C"
            trend={{ type: 'down', value: '-2%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Offres actives"
            value={stats.activeOffers}
            icon={<TrendingUpIcon />}
            color="#EC681C"
            trend={{ type: 'up', value: '+8%' }}
          />
        </Grid>
      </Grid>

      {/* Statistiques secondaires */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Séances payées"
            value={stats.paidSessions.toLocaleString()}
            icon={<PaymentIcon />}
            color="#4A8B6B"
            trend={{ type: 'up', value: '+22% ce mois' }}
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
            trend={{ type: 'up', value: '+18% ce mois' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <StatCard
            title="Bénéfice global"
            value={`${stats.globalProfit.toLocaleString('fr-FR')} FCFA`}
            icon={<TrendingUpIcon />}
            color="#FAB73C"
            trend={{ type: 'up', value: '+25% ce mois' }}
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
                  <Bar dataKey="users" fill="#0B442D" name="Utilisateurs" radius={[6, 6, 0, 0]} />
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
