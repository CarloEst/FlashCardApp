'use client'

import {useUser} from '@clerk/nextjs'
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CardActionArea, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material'
import {writeBatch, collection, doc, getDoc} from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { db } from '../../firebase'



export default function Generate() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const [flipped, setFlipped] = useState({})
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const goToFlashcards = () => {
        router.push('/flashcards')
    }

  
    const handleSubmit = async () => {
        fetch('/api/generate', {
            method: 'POST',
            body: text,
          })
            .then((res) => res.json())
            .then(data => setFlashcards(data))
      }

      const handleCardClick = (id) => {
        setFlipped((prev) => ({
          ...prev,
          [id]: !prev[id],
        }))
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
            if (collections.find((f)=>f.name === name)) {
                alert('Flashcard collection with the same name already exists.')
                return
            }
            else{
                collections.push({name})
                batch.set(userDocRef, {flashcards: collections}, {merge: true})
            }
        }
        else{
            batch.set(userDocRef, {flashcards: [{name}]})
        }
        
        const colRef = collection(userDocRef, name)
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(colRef)
            batch.set(cardDocRef, flashcard)
        })
              
        await batch.commit()
        handleClose()
        router.push('/flashcards')
      }

      return(
        <Container maxWidth="md">
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                Generate Flashcards
                </Typography>
                <TextField
                value={text}
                onChange={(e) => setText(e.target.value)}
                label="Enter text"
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ mb: 2 }}
                />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
                <Button
                        variant="contained"
                        color="primary"
                        onClick={goToFlashcards}
                    >
                        View Saved Flashcards
                    </Button>
                </Box>
            </Box>
        
            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                    Generated Flashcards
                    </Typography>
                    <Grid container spacing={2}>
                    {flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                        <CardActionArea onClick={()=> handleCardClick(index)}>
                            <CardContent>
                                <Box sx={{ 
                                    perspective: '1000px',
                                    '& > div' : {
                                        transition: 'transform 0.6s',
                                        transformStyle: 'preserve-3d',
                                        position: 'relative',
                                        width: '100%',
                                        height: '200px',
                                        boxShadow: '0 4px 8px 0 rgba(0,0,0, 0.2)',
                                        transform: flipped[index]
                                        ? 'rotateY(180deg)'
                                        : 'rotateY(0deg)',
                                    }, 
                                    '& > div > div' : {
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
                                    '& > div > div:nth-of-type(2)':{
                                        transform: 'rotateY(180deg)',
                                    },
                                }}
                                >
                                    <div>
                                        <div>
                                        <Typography variant="h5" component="div">
                                            {flashcard.front}
                                        </Typography>
                                        </div>
                                        <div>
                                        <Typography variant="h5" component="div">
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
                    <Box sx={{mt:4, display: 'flex', justifyContent:'center'}}>
                        <Button variant='contained' color='secondary' onClick={handleOpen}>
                            Save
                        </Button>

                    </Box>
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                        <Button variant='contained' color='primary' onClick={goToFlashcards}>
                            View Saved Flashcards
                        </Button>
                    </Box>
                </Box>
            )}
            <Dialog open={open} onClose={handleClose}>
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
                    variant='outlined'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards} color="primary">
                    Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
      )
  }