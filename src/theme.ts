import { createTheme } from '@mui/material';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Saddle Brown
    },
    secondary: {
      main: '#A0522D', // Sienna
    },
    background: {
      default: '#FFF8DC', // Cornsilk
      paper: '#FAEBD7', // Antique White
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#8B4513', // Matching primary color
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
}); 