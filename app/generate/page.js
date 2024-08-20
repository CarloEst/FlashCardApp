'use client'

import { useUser } from '@clerk/nextjs'
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, CircularProgress } from '@mui/material'
import { writeBatch, collection, doc, getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { db } from '../../firebase'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import BackButton from '../../BackButton';

const theme = createTheme({
  palette: {
    primary: { main: '#5C258D' },
    secondary: { main: '#4389A2' }
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h6: { fontWeight: 700, letterSpacing: '0.05em', color: 'white' },
    h4: { fontWeight: 600, letterSpacing: '0.02em', color: 'white' },
    button: {
      textTransform: 'none',
    }
  }
});

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [text, setText] = useState('')
  const [name, setName] = useState('')
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  
  
    const goToFlashcards = () => {
        router.push('/flashcards')
    }

    const goToHome = () => {
        router.push('/')
    }

  const handleSubmit = async () => {
    setLoading(true)
    fetch('/api/generate', { method: 'POST', body: text })
      .then(res => res.json())
      .then(data => {
        setFlashcards(data)
        setLoading(false)
      })
  }

  const handleCardClick = (id) => {
    setFlipped(prev => ({ ...prev, [id]: !prev[id] }))
  }
  
   const handleOpen = () => {setOpen(true)}
   const handleClose = () => {setOpen(false)}

  const saveFlashcards = async () => {
    if (!name.trim()) {
      alert('Please enter a name.')
      return
    }

    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find(f => f.name === name)) {
        alert('Flashcard collection with the same name already exists.')
        return
      } else {
        collections.push({ name })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] })
    }

    const colRef = collection(userDocRef, name)
    flashcards.forEach(flashcard => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    setOpen(false)
    router.push('/flashcards')
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
                fontWeight: 700,
                textTransform: 'none',
                textDecoration: 'none',
                fontSize: '1.2rem',
                '&:hover': {
                  backgroundColor: 'transparent',
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
                borderColor: 'white',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '10px',
                px: 2,
                py: 0.5,
                fontSize: '1rem',
                '&:hover': {
                  borderColor: 'white',
                  transform: 'scale(1.05)',
                  transition: '0.3s',
                },
                '&:active': {
                  color: 'white',
                },
                '&:focus': {
                  textDecoration: 'none',
                }
              }}
            >
              BACK
            </Button>
          </Box>

          <Typography variant="h4" component="h1" sx={{ textAlign: 'center', color: 'white', mb: 1 }}>
            Generate Flashcards
          </Typography>
          <Typography variant="h6" component="h2" sx={{ textAlign: 'center', color: 'white', mb: 4 }}>
            Drop in your notes and we'll do the rest!
          </Typography>

          <TextField
            value={text}
            onChange={(e) => setText(e.target.value)}
            label="Enter text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            InputProps={{
              style: { color: 'white' },
            }}
            InputLabelProps={{
              style: { color: 'white' },
            }}
            sx={{
              mb: 2,
              '& fieldset': { borderColor: 'white' },
              '& .MuiOutlinedInput-root.Mui-focused fieldset': { borderColor: 'white' },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleSubmit}
              sx={{
                fontWeight: 700,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  transform: 'scale(1.05)',
                  transition: '0.3s',
                },
              }}
            >
              Submit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push('/flashcards')}
              sx={{
                fontWeight: 700,
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  transform: 'scale(1.05)',
                  transition: '0.3s',
                },
              }}
            >
              View Saved Sets
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
              <CircularProgress color="secondary" />
            </Box>
          ) : (
            flashcards.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Grid container spacing={2}>
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
                            }}>
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
                <Box sx={{mt:4, display: 'flex', justifyContent:'center', gap: 2}}>
                        <Button variant='contained' color='secondary' 
                        sx={{
                            py: 1.5,
                            px: 4,
                            borderRadius: '50px',
                            boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                transition: '0.3s'
                            },
                        }}
                        onClick={handleOpen}>
                           
                    Save
                  </Button>
                </Box>
              </Box>
            )
          )}

          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Save Flashcards</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter a name for your flashcard collection.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Collection Name"
                type="text"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={saveFlashcards}>Save</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Container>
    </ThemeProvider>
  )
}
