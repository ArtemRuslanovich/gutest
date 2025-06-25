import axios from 'axios'

const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Обработка ошибок
api.interceptors.response.use(
  response => response.data,
  error => {
    let message = 'Произошла ошибка'
    
    if (error.response) {
      message = error.response.data?.error || `Ошибка ${error.response.status}`
    } else if (error.request) {
      message = 'Сервер не отвечает'
    } else {
      message = error.message
    }
    
    return Promise.reject(new Error(message))
  }
)

export default {
  get(url, config) {
    return api.get(url, config)
  },
  post(url, data, config) {
    return api.post(url, data, config)
  }
}