import axios from 'axios'
export const api = axios.create({ baseURL: '/api' })

// call after login
export function setAuth(username: string, password: string) {
  api.defaults.auth = { username, password }
}
