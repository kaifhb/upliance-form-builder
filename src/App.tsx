
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import CreateForm from './pages/CreateForm'
import PreviewForm from './pages/PreviewForm'
import MyForms from './pages/MyForms'

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>upliance.ai Form Builder</Typography>
          <Button color="inherit" component={Link} to="/create">Create</Button>
          <Button color="inherit" component={Link} to="/preview">Preview</Button>
          <Button color="inherit" component={Link} to="/myforms">My Forms</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3, mb: 8 }}>
        <Routes>
          <Route path="/" element={<CreateForm />} />
          <Route path="/create" element={<CreateForm />} />
          <Route path="/preview" element={<PreviewForm />} />
          <Route path="/preview/:id" element={<PreviewForm />} />
          <Route path="/myforms" element={<MyForms />} />
        </Routes>
      </Container>
    </BrowserRouter>
  )
}