import axios from 'axios'
import { API_CONFIG } from '../config'
import toast from 'react-hot-toast'

// Create axios instance for Response Service
export const responseApi = axios.create({
    baseURL: API_CONFIG.RESPONSE_SERVICE,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Create axios instance for Feedback Service
export const feedbackApi = axios.create({
    baseURL: API_CONFIG.FEEDBACK_SERVICE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Create axios instance for QR Service
export const qrApi = axios.create({
    baseURL: API_CONFIG.QR_SERVICE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Response interceptor for error handling
const handleError = (error) => {
    if (error.response) {
        // Server responded with error
        const message = error.response.data?.error ||
            error.response.data?.message ||
            'Something went wrong'

        console.error('API Error:', {
            status: error.response.status,
            message,
            data: error.response.data,
        })

        // Don't show toast for 404s (we handle them in components)
        if (error.response.status !== 404) {
            toast.error(message)
        }
    } else if (error.request) {
        // Request made but no response
        console.error('Network Error:', error.request)
        toast.error('Network error. Please check your connection.')
    } else {
        // Something else happened
        console.error('Error:', error.message)
        toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
}

// Add error interceptors to all instances
responseApi.interceptors.response.use(
    (response) => response,
    handleError
)

feedbackApi.interceptors.response.use(
    (response) => response,
    handleError
)

qrApi.interceptors.response.use(
    (response) => response,
    handleError
)

export default responseApi
