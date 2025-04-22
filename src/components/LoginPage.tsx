import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Navigate, useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      if (credentialResponse.credential) {
        // Store the token
        localStorage.setItem('token', credentialResponse.credential);
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (localStorage.getItem('token')) {
    return <Navigate to="/" replace />;
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom>
            Gratitude Journal
          </Typography>
          <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
            Sign in to start recording your daily gratitude moments
          </Typography>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
            useOneTap
          />
        </Paper>
      </Box>
    </Container>
  );
};