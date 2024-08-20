'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from 'firebase/firestore'
import { Container, Box, Typography, Button, Grid, Card, CardContent, CardActionArea } from '@mui/material'
import { db } from "../../firebase"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
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
    body1: { color: 'white' }, // Ensure body text is white
  }
});

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const router = useRouter()

  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [search, user])

  const goToHome = () => {
    router.push('/')
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
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
            Your Study Set
          </Typography>

          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent>
                      <Box sx={{ 
                          perspective: '1000px',
                          '& > div': {
                            transition: 'transform 0.6s',
                            transformStyle: 'preserve-3d',
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          },
                          '& > div > div': {
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            backfaceVisibility: 'hidden',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: 2,
                            boxSizing: 'border-box',
                          },
                          '& > div > div:nth-of-type(2)': {
                            transform: 'rotateY(180deg)',
                          },
                        }}
                      >
                        <div>
                          <div>
                            <Typography variant="h5" component="div" sx={{ color: 'white' }}>
                              {flashcard.front}
                            </Typography>
                          </div>
                          <div>
                            <Typography variant="h5" component="div" sx={{ color: 'white' }}>
                              {flashcard.back}
                            </Typography>
                          </div>
                        </div>
                      </Box>
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
