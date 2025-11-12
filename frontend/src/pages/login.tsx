import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuth, api } from '../api'
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  
  InputAdornment
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

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
          Product Dashboard
        </Typography>
        <Box component="form" onSubmit={handleSubmit} display="grid" gap={2}>
          <TextField
            label="Username"
            placeholder="Enter your username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            autoComplete="username"
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              )
            }}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            fullWidth
            autoComplete="current-password"
            required
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              )
            }}
          />
          {error && (
            <Typography color="error" fontSize={14}>
              {error}
            </Typography>
          )}
          <Button type="submit" variant="contained" fullWidth>
            LOGIN
          </Button>
          <Link href="#" variant="body2" textAlign="center"> Forgot password? </Link>
          <Typography variant="caption" textAlign="center" color="text.secondary">
            © 2025 Varun Pasunoori – MSc Computing
          </Typography>
        </Box>
      </Paper>
    </Box>
  )
}
