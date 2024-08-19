'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import {collection, doc, getDoc, setDoc} from 'firebase/firestore'
import { Container, Box, Typography, TextField, Button, Grid, Card, CardContent, CardActionArea } from '@mui/material'
import { db } from "../../firebase"
import { useRouter } from "next/navigation"
import BackButton from '../../BackButton';

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

      const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`)
      }

      return (
        <Container maxWidth="100vw">
          <Box sx={{ my: 4 }}>
                <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
                    <BackButton />
                </Box>
                <Box sx={{ position: 'absolute', top: 0, right: 0 }}>
                    <Button variant="contained" color="primary" onClick={goToHome}>
                        Flashcards SaaS
                    </Button>
                </Box>
          </Box>
          <Grid container spacing={3} sx={{ mt: 4 }}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      )
  }