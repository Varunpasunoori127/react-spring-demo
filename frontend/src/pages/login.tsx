import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth, api } from '../api'
import {
  Box, Button, TextField, Typography, Paper, Link
} from '@mui/material'

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
        backgroundColor: '#1976D2'
      }}
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 400,
          borderRadius: 2,
          backgroundColor: '#fff'
        }}
      >
        <Typography variant="h5" mb={2} textAlign="center">
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            autoComplete="username"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
            required
          />
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            Login
          </Button>
          <Link href="#" variant="body2" textAlign="center">
            Forgot password?
          </Link>
        </Box>
      </Paper>
    </Box>
  )
}
