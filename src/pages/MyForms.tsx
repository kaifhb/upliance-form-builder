import * as React from 'react'
import { loadForms } from '../services/storage'
import { Card, CardContent, CardActionArea, Typography, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function MyForms() {
  const [forms, setForms] = React.useState(loadForms())
  const nav = useNavigate()

  React.useEffect(()=>{
    setForms(loadForms())
  }, [])

  if (!forms.length) {
    return <Typography>No saved forms yet.</Typography>
  }

  return (
    <Grid container spacing={2}>
      {forms.map(f => (
        <Grid item xs={12} md={6} lg={4} key={f.id}>
          <Card>
            <CardActionArea onClick={()=>nav(`/preview/${f.id}`)}>
              <CardContent>
                <Typography variant="h6">{f.name ?? '(Untitled form)'}</Typography>
                <Typography variant="body2">Created: {f.createdAt ? new Date(f.createdAt).toLocaleString() : '—'}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}