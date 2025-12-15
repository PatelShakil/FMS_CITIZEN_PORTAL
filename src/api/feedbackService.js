import { feedbackApi } from './axios'

export const feedbackService = {
    /**
     * Get public form by formId
     * GET /api/forms/{formId}/public
     */
    getPublicForm: async (formId) => {
        try {
            const response = await feedbackApi.get(`/${formId}/public`)
            return response.data
        } catch (error) {
            console.error('Error fetching form:', error)
            throw error
        }
    },

    /**
     * Get form preview (for testing)
     * GET /api/forms/{formId}
     */
    getFormPreview: async (formId) => {
        try {
            const response = await feedbackApi.get(`/api/forms/${formId}`)
            return response.data
        } catch (error) {
            console.error('Error fetching form preview:', error)
            throw error
        }
    },
}
