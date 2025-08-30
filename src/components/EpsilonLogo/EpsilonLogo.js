import React from 'react';
import { Box } from '@mui/material';
import logoFullSvg from '../../assets/Fichier 1.svg';
import logoCompactSvg from '../../assets/e.svg';

const EpsilonLogo = ({ width = 140, height = 40, showText = true, compact = false }) => {
  const logoSrc = compact ? logoCompactSvg : logoFullSvg;
  
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: width, 
      height: height,
      '& img': {
        width: '100%',
        height: '100%',
        objectFit: 'contain'
      }
    }}>
      <img 
        src={logoSrc} 
        alt="Epsilon Logo" 
        style={{
          width: width,
          height: height,
          objectFit: 'contain'
        }}
      />
    </Box>
  );
};

export default EpsilonLogo;
