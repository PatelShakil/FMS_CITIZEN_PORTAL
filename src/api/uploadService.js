import { responseApi } from './axios'

export const uploadService = {
    /**
     * Upload a single file to MinIO
     * POST /api/upload
     */
    uploadFile: async (file, onProgress) => {
        try {
            const formData = new FormData()
            formData.append('file', file)

            const response = await responseApi.post('/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    if (onProgress && progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        )
                        onProgress(percentCompleted)
                    }
                },
            })

            return response.data
        } catch (error) {
            console.error('Error uploading file:', error)
            throw error
        }
    },

    /**
     * Upload multiple files
     * POST /api/upload (called multiple times)
     */
    uploadMultipleFiles: async (files, onProgress) => {
        try {
            const uploadPromises = files.map((file, index) => {
                return uploadService.uploadFile(file, (percent) => {
                    if (onProgress) {
                        onProgress(index, percent)
                    }
                })
            })

            const results = await Promise.all(uploadPromises)
            return results
        } catch (error) {
            console.error('Error uploading multiple files:', error)
            throw error
        }
    },

    /**
     * Validate file before upload
     */
    validateFile: (file, allowedFormats = [], maxSizeBytes = 10485760) => {
        const errors = []

        // Check file size (default 10MB)
        if (file.size > maxSizeBytes) {
            const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(1)
            errors.push(`File size exceeds ${maxSizeMB}MB limit`)
        }

        // Check file format
        if (allowedFormats.length > 0) {
            const fileExtension = file.name.split('.').pop().toLowerCase()
            const mimeType = file.type.toLowerCase()

            const isAllowed = allowedFormats.some(format => {
                const formatLower = format.toLowerCase()
                return fileExtension === formatLower || mimeType.includes(formatLower)
            })

            if (!isAllowed) {
                errors.push(
                    `File format not allowed. Allowed: ${allowedFormats.join(', ')}`
                )
            }
        }

        return {
            valid: errors.length === 0,
            errors,
        }
    },
}
