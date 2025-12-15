import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

export const useFormStore = create(
    devtools(
        persist(
            (set, get) => ({
                // Form metadata
                formData: null,
                qrData: null,

                // Form answers (field responses)
                answers: {},

                // Validation errors
                errors: {},

                // Form state
                isLoading: false,
                isSubmitting: false,
                currentStep: 0,
                completionTime: 0,
                startTime: null,

                // Location data
                location: null,

                // Device info
                deviceInfo: null,

                // Actions
                setFormData: (formData) => set({ formData }),

                setQRData: (qrData) => set({ qrData }),

                setAnswer: (fieldId, value) =>
                    set((state) => ({
                        answers: {
                            ...state.answers,
                            [fieldId]: value,
                        },
                    })),

                setAnswers: (answers) => set({ answers }),

                setError: (fieldId, error) =>
                    set((state) => ({
                        errors: {
                            ...state.errors,
                            [fieldId]: error,
                        },
                    })),

                clearError: (fieldId) =>
                    set((state) => {
                        const newErrors = { ...state.errors }
                        delete newErrors[fieldId]
                        return { errors: newErrors }
                    }),

                setErrors: (errors) => set({ errors }),

                clearErrors: () => set({ errors: {} }),

                setLoading: (isLoading) => set({ isLoading }),

                setSubmitting: (isSubmitting) => set({ isSubmitting }),

                setCurrentStep: (step) => set({ currentStep: step }),

                nextStep: () =>
                    set((state) => ({
                        currentStep: Math.min(
                            state.currentStep + 1,
                            state.formData?.fields?.length - 1 || 0
                        ),
                    })),

                prevStep: () =>
                    set((state) => ({
                        currentStep: Math.max(state.currentStep - 1, 0),
                    })),

                setLocation: (location) => set({ location }),

                setDeviceInfo: (deviceInfo) => set({ deviceInfo }),

                startTimer: () =>
                    set({
                        startTime: Date.now(),
                    }),

                stopTimer: () =>
                    set((state) => ({
                        completionTime: state.startTime
                            ? Math.floor((Date.now() - state.startTime) / 1000)
                            : 0,
                    })),

                // Reset entire form
                resetForm: () =>
                    set({
                        formData: null,
                        qrData: null,
                        answers: {},
                        errors: {},
                        isLoading: false,
                        isSubmitting: false,
                        currentStep: 0,
                        completionTime: 0,
                        startTime: null,
                        location: null,
                    }),

                // Get answer by field ID
                getAnswer: (fieldId) => get().answers[fieldId],

                // Check if field has error
                hasError: (fieldId) => !!get().errors[fieldId],

                // Get progress percentage
                getProgress: () => {
                    const { formData, answers } = get()
                    if (!formData?.fields) return 0

                    const requiredFields = formData.fields.filter((f) => f.required)
                    const answeredRequired = requiredFields.filter(
                        (f) => answers[f.fieldId] !== undefined && answers[f.fieldId] !== ''
                    )

                    return requiredFields.length > 0
                        ? Math.round((answeredRequired.length / requiredFields.length) * 100)
                        : 0
                },
            }),
            {
                name: 'boloindia-form-storage',
                partialize: (state) => ({
                    // Only persist answers and form data
                    answers: state.answers,
                    formData: state.formData,
                    qrData: state.qrData,
                    currentStep: state.currentStep,
                }),
            }
        ),
        { name: 'FormStore' }
    )
)
