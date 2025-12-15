import { useQuery } from '@tanstack/react-query'
import { feedbackService } from '../api/feedbackService'
import { useFormStore } from '../store/formStore'
import { useEffect } from 'react'

export const useFormData = (formId) => {
    const setFormData = useFormStore((state) => state.setFormData)
    const setLoading = useFormStore((state) => state.setLoading)

    const query = useQuery({
        queryKey: ['form', formId],
        queryFn: () => feedbackService.getPublicForm(formId),
        enabled: !!formId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry: 2,
    })

    useEffect(() => {
        // console.log('useFormData query:', formId)
        if (query.data?.data) {
            setFormData(query.data.data)
        }
    }, [query.data, setFormData])

    useEffect(() => {
        setLoading(query.isLoading)
    }, [query.isLoading, setLoading])

    return {
        formData: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
    }
}
