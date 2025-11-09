import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth, api } from '../api'
import { Box, Button, TextField, Typography, Paper } from '@mui/material'

export default function Login() {
  const [username, setUsername] = useState('demo')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuth(username, password)
    try {
      await api.get('/health')
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(208, 10, 36, 0.56)' // customize this to match your brand
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 360 }}>
        <Typography variant="h5" mb={2} textAlign="center">Login</Typography>
        <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth>Login</Button>
        </Box>
      </Paper>
    </Box>
  )
}
