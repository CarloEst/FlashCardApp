'use client'

import Image from "next/image";
import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, Grid, Paper, IconButton } from '@mui/material';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DevicesIcon from '@mui/icons-material/Devices';

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
    h2: {
      fontWeight: 700,
      letterSpacing: '0.05em',
      color: 'white',
    },
    h5: {
      fontWeight: 500,
      letterSpacing: '0.02em',
      color: 'white',
    },
  },
});




export default function Home() {
  const { isLoaded, isSignedIn } = useUser();
    const router = useRouter();
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const goToFlashcards = () => {
    router.push('/flashcards')
  }

  const handleStartForFreeClick = () => {
    if (!isSignedIn) {
      window.alert('You need to sign in first.');
      router.push('/sign-in'); // Replace with the actual path to the next page
    } else {
      router.push('/generate');
    }
  };
  

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ px: 4, py: 4, background: 'linear-gradient(135deg, #5C258D 30%, #4389A2 90%)', minHeight: '100vh' }}>
        <Head>
          <title>Flashcard</title>
          <meta name="description" content="Create flashcards from text" />
        </Head>
        <AppBar position="sticky" sx={{ mb: 2, backgroundColor: 'transparent', boxShadow: 'none', mt: -2 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Flashcard SaaS
            </Typography>
            <SignedOut>
              <Button
                color="inherit"
                href="/sign-in"
                sx={{
                  border: '1px solid white',
                  borderRadius: '10px',
                  px: 1,
                  py: 0.5,
                  mr: 3,
                  '&:hover': {
                    boxShadow: '0px 8px 15px rgba(106, 27, 154, 0.3)',
                    transform: 'scale(1.05)',
                    transition: '0.3s'
                  },
                }}
              >
                Log In
              </Button>
              <Button
                color="inherit"
                href="/sign-up"
                sx={{
                  border: '1px solid white',
                  borderRadius: '10px',
                  px: 1,
                  py: 0.5,
                  '&:hover': {
                    boxShadow: '0px 8px 15px rgba(106, 27, 154, 0.3)',
                    transform: 'scale(1.05)',
                    transition: '0.3s'
                  },
                }}
              >
                Sign Up
              </Button>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Toolbar>
        </AppBar>

        <Box sx={{ textAlign: 'center', color: 'white', mb: 6 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Flashcard SaaS
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            The easiest way to create flashcards from your text.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            sx={{
              mt: 4,
              mr: 2,
              py: 1.5,
              px: 4,
              borderRadius: '50px',
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.3s'
              },
            }}
            onClick={handleStartForFreeClick}
          >
            Start for Free
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            sx={{
              mt: 4,
              py: 1.5,
              px: 4,
              borderRadius: '50px',
              borderColor: 'white',
              color: 'white',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.3s'
              },
            }}
            onClick={goToFlashcards}
          >
            View Saved Flashcards
          </Button>
        </Box>

        <Box sx={{ my: 8 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ color: 'white', fontWeight: 700, textAlign: 'center' }}>
            Features
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: '15px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textAlign: 'center',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <IconButton aria-label="text input" sx={{ mb: 1 }}>
                  <TextFieldsIcon fontSize="large" sx={{ color: 'white' }} />
                </IconButton>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Easy Text Input
                </Typography>
                <Typography>
                  Simply input your text and let our software do the rest. Creating flashcards has never been easier.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: '15px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textAlign: 'center',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <IconButton aria-label="smart flashcards" sx={{ mb: 1 }}>
                  <FlashOnIcon fontSize="large" sx={{ color: 'white' }} />
                </IconButton>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Smart Flashcards
                </Typography>
                <Typography>
                  Our AI intelligently breaks down your text into concise flashcards, perfect for studying.
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                elevation={6}
                sx={{
                  p: 3,
                  borderRadius: '15px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  textAlign: 'center',
                  height: '100%',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    transition: 'transform 0.3s ease',
                  },
                }}
              >
                <IconButton aria-label="accessible anywhere" sx={{ mb: 1 }}>
                  <DevicesIcon fontSize="large" sx={{ color: 'white' }} />
                </IconButton>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Accessible Anywhere
                </Typography>
                <Typography>
                  Access your flashcards from any device, at any time. Study on the go with ease.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mt: 8, pt: 4, textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            © 2024 Flashcard SaaS. All rights reserved. 
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
