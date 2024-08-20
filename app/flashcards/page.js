'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActionArea } from '@mui/material'
import { db } from "../../firebase"
import { useRouter } from "next/navigation"
import BackButton from '../../BackButton'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: { main: '#5C258D' },
    secondary: { main: '#4389A2' }
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: { fontWeight: 700, letterSpacing: '0.05em', color: 'white' },
    h4: { fontWeight: 600, letterSpacing: '0.02em', color: 'white' },
    body1: { color: 'white' }, // Default text color
    body2: { color: 'white' }, // For smaller text if needed
  }
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  const goToHome = () => {
    router.push('/')
  }

  const handleCardClick = (name) => {
    router.push(`/flashcard?id=${name}`)
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth={false} sx={{ px: 4, py: 4, background: 'linear-gradient(135deg, #5C258D 30%, #4389A2 90%)', minHeight: '100vh' }}>
        <Box sx={{ my: 4, position: 'relative' }}>
          <Box sx={{ position: 'fixed', top: '20px', left: '20px', zIndex: 1000, mt: 1 }}>
            <Button 
              onClick={() => router.push('/')}
              sx={{
                color: 'white',
                fontWeight: 700, // Bold
                textTransform: 'none', // No uppercase transformation
                textDecoration: 'none', // No underlining
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: 'transparent', // No background on hover
                },
              }}
            >
              FlashBro
            </Button>
          </Box>
          
          <Box sx={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000, mt: 1 }}>
            <Button  
              onClick={() => router.back()} 
              sx={{
                fontWeight: 700,
                borderColor: 'white', // White outline
                color: 'white', // White text
                textDecoration: 'none', // No underlining
                borderRadius: '10px',
                px: 2,
                py: 0.5,
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'white',
                  transform: 'scale(1.05)', // Enlarge on hover
                  transition: '0.3s',
                },
                '&:active': {
                  color: 'white', // Ensure text stays white when clicked
                },
                '&:focus': {
                  textDecoration: 'none', // No underline when focused
                }
              }}
            >
              BACK
            </Button>
          </Box>

          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
            Your Flashcard Sets
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent sx={{ color: 'white' }}>
                      <Typography 
                        variant="h6" 
                        component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
