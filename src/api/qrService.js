import { qrApi } from './axios'

export const qrService = {
    /**
     * Scan QR code (track scan)
     * GET /api/qr/s/{qrCodeSlug}
     */
    scanQR: async (qrCodeSlug) => {
        try {
            const response = await qrApi.get(`/s/${qrCodeSlug}`)
            return response.data
        } catch (error) {
            console.error('Error scanning QR:', error)
            throw error
        }
    },

    /**
     * Track QR scan with metadata
     * POST /api/qr/scan/{qrCodeSlug}
     */
    trackScan: async (qrCodeSlug, metadata = {}) => {
        try {
            const response = await qrApi.post(`/scan/${qrCodeSlug}`, metadata)
            return response.data
        } catch (error) {
            console.error('Error tracking scan:', error)
            throw error
        }
    },

    /**
     * Get QR code details by ID
     * GET /api/qr/{qrCodeId}
     */
    getQRDetails: async (qrCodeId) => {
        try {
            const response = await qrApi.get(`/api/qr/${qrCodeId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching QR details:', error)
            throw error
        }
    },
}
