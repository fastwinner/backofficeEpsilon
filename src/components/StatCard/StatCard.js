import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

function StatCard({ title, value, icon, color, trend }) {
  // const theme = useTheme();
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%)',
        border: '1px solid #E5E7EB',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`,
        },
      }}
    >
      <CardContent sx={{ p: 2, pt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.8px',
                color: '#6B7280',
                mb: 2,
                display: 'block',
              }}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 600,
                fontSize: '2rem',
                lineHeight: 1.1,
                color: '#111827',
                mb: 1,
                fontFamily: '"Inter", sans-serif',
              }}
            >
              {value}
            </Typography>
            {trend && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {trend.type === 'up' ? (
                  <TrendingUp sx={{ fontSize: 16, color: '#10B981' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 16, color: '#EF4444' }} />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: trend.type === 'up' ? '#10B981' : '#EF4444',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                  }}
                >
                  {trend.value}
                </Typography>
              </Box>
            )}
          </Box>
          <Box
            sx={{
              background: `linear-gradient(135deg, ${color}15 0%, ${color}08 100%)`,
              borderRadius: 2,
              width: 56,
              height: 56,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: color,
              flexShrink: 0,
              border: `1px solid ${color}20`,
              '& svg': {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default StatCard;
