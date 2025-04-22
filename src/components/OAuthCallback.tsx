import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';

export const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    console.log('OAuthCallback component mounted');
    console.log('Current URL:', window.location.href);
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    console.log('Token from URL:', token);

    if (token) {
      console.log('Storing token in localStorage...');
      localStorage.setItem('token', token);
      navigate('/', { replace: true });
    } else {
      console.log('No token found, redirecting to login...');
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography>Completing sign in...</Typography>
    </Box>
  );
}; 