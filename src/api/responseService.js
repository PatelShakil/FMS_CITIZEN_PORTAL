import { responseApi } from './axios'

export const responseService = {
    /**
     * Submit a new response
     * POST /api/responses
     */
    submitResponse: async (responseData) => {
        try {
            const response = await responseApi.post('/', responseData)
            return response.data
        } catch (error) {
            console.error('Error submitting response:', error)
            throw error
        }
    },

    /**
     * Get response by ID
     * GET /api/responses/{responseId}
     */
    getResponseById: async (responseId) => {
        try {
            const response = await responseApi.get(`/${responseId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching response:', error)
            throw error
        }
    },

    /**
     * Get responses for a form
     * GET /api/responses/form/{formId}
     */
    getFormResponses: async (formId, params = {}) => {
        try {
            const response = await responseApi.get(`/form/${formId}`, {
                params,
            })
            return response.data
        } catch (error) {
            console.error('Error fetching form responses:', error)
            throw error
        }
    },

    /**
     * Get response statistics
     * GET /api/responses/stats
     */
    getResponseStats: async (params = {}) => {
        try {
            const response = await responseApi.get('/stats', {
                params,
            })
            return response.data
        } catch (error) {
            console.error('Error fetching response stats:', error)
            throw error
        }
    },
}
