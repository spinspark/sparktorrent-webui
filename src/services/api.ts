import axios from 'axios'

export const api = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
})
