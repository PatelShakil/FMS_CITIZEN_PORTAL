export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    FEEDBACK_SERVICE: import.meta.env.VITE_FEEDBACK_SERVICE_URL || 'http://localhost:8000/forms',
    QR_SERVICE: import.meta.env.VITE_QR_SERVICE_URL || 'http://localhost:8000/qr',
    RESPONSE_SERVICE: import.meta.env.VITE_RESPONSE_SERVICE_URL || 'http://localhost:8000/responses',
}

export const APP_CONFIG = {
    APP_NAME: 'BoloIndia',
    APP_TAGLINE: 'Your Voice Matters',
    PORT: 3000,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB default (overridden by form settings)
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
    ALLOWED_AUDIO_TYPES: ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm'],
}

export const FIELD_TYPES = {
    TEXT: 'text',
    TEXTAREA: 'textarea',
    EMAIL: 'email',
    PHONE: 'phone',
    NUMBER: 'number',
    DATE: 'date',
    TIME: 'time',
    DATETIME: 'datetime',
    DROPDOWN: 'dropdown',
    RADIO: 'radio',
    CHECKBOX: 'checkbox',
    RATING: 'rating',
    FILE: 'file',
    IMAGE: 'image',
    VIDEO: 'video',
    AUDIO: 'audio',
    LOCATION: 'location',
}
