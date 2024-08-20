'use client';

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: '#5C258D', // Purple color
      },
      secondary: {
        main: '#4389A2', // Blue color
      },
    },
    typography: {
      fontFamily: "'Roboto', sans-serif",
      h6: {
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: 'white',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '0.02em',
        color: 'white',
      },
    },
});

export default function SignUpPage() {
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ px: 4, py: 4, background: 'linear-gradient(135deg, #5C258D 30%, #4389A2 90%)', minHeight: '100vh' }}>
        <AppBar position="sticky" sx={{ mb: 2, backgroundColor: 'transparent', boxShadow: 'none', mt: -2 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              FlashBro
            </Typography>
            <Button
              color="inherit"
              sx={{
                border: '1px solid white',
                borderRadius: '10px',
                px: 1,
                py: 0.5,
                mr: 3,
                textTransform: 'none',
                fontSize: '0.9rem',
                color: 'white',
                '&:hover': {
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                  transform: 'scale(1.05)',
                  transition: '0.3s',
                },
                textDecoration: 'none',
              }}
            >
              <Link href="/sign-in" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                SIGN IN
              </Link>
            </Button>
            <Button
              color="inherit"
              sx={{
                border: '1px solid white',
                borderRadius: '10px',
                px: 1,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.9rem',
                color: 'white',
                '&:hover': {
                  boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.3)',
                  transform: 'scale(1.05)',
                  transition: '0.3s',
                },
                textDecoration: 'none',
              }}
            >
              <Link href="/sign-up" passHref style={{ textDecoration: 'none', color: 'inherit' }}>
                SIGN UP
              </Link>
            </Button>
          </Toolbar>
        </AppBar>

        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ textAlign: 'center', color: 'white', my: 6 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <SignUp />
        </Box>
      </Container>
    </ThemeProvider>
  );
}
