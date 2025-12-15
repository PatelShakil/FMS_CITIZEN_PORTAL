import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { responseService } from '../../api/responseService'
import { useFormStore } from '../../store/formStore'
import { useGeolocation } from '../../hooks/useGeolocation'
import { validateForm } from '../../utils/validation'
import toast from 'react-hot-toast'

// Components
import FormProgress from './FormProgress'
import Button from '../UI/Button'
import ErrorMessage from '../UI/ErrorMessage'

// Field Type Components (we'll create these next)
import TextField from '../FieldTypes/TextField'
import TextareaField from '../FieldTypes/TextareaField.jsx'
import EmailField from '../FieldTypes/EmailField'
import PhoneField from '../FieldTypes/PhoneField'
import NumberField from '../FieldTypes/NumberField'
import DateField from '../FieldTypes/DateField'
import TimeField from '../FieldTypes/TimeField'
import DateTimeField from '../FieldTypes/DateTimeField'
import DropdownField from '../FieldTypes/DropdownField'
import RadioField from '../FieldTypes/RadioField'
import CheckboxField from '../FieldTypes/CheckboxField'
import RatingField from '../FieldTypes/RatingField'
import FileField from '../FieldTypes/FileField'
import ImageField from '../FieldTypes/ImageField'
import VideoField from '../FieldTypes/VideoField'
import AudioField from '../FieldTypes/AudioField'
import LocationField from '../FieldTypes/LocationField'

const FormRenderer = ({ formData, qrData }) => {
    const navigate = useNavigate()
    const [submitError, setSubmitError] = useState(null)

    // Store
    const answers = useFormStore((state) => state.answers)
    const errors = useFormStore((state) => state.errors)
    const setErrors = useFormStore((state) => state.setErrors)
    const stopTimer = useFormStore((state) => state.stopTimer)
    const completionTime = useFormStore((state) => state.completionTime)
    const location = useFormStore((state) => state.location)
    const deviceInfo = useFormStore((state) => state.deviceInfo)

    // Geolocation hook
    const { fetchLocation } = useGeolocation(formData?.settings?.requireLocation)

    // Submit mutation
    const submitMutation = useMutation({
        mutationFn: (data) => responseService.submitResponse(data),
        onSuccess: () => {
            toast.success('Feedback submitted successfully!')
            navigate('/success')
        },
        onError: (error) => {
            const errorMsg = error.response?.data?.error || 'Failed to submit feedback'
            setSubmitError(errorMsg)
            toast.error(errorMsg)
        },
    })

    // Field type mapper
    const renderField = (field) => {
        const commonProps = {
            key: field.fieldId,
            field,
        }

        switch (field.fieldType.toLowerCase()) {
            case 'text':
                return <TextField {...commonProps} />
            case 'textarea':
                return <TextareaField {...commonProps} />
            case 'email':
                return <EmailField {...commonProps} />
            case 'phone':
                return <PhoneField {...commonProps} />
            case 'number':
                return <NumberField {...commonProps} />
            case 'date':
                return <DateField {...commonProps} />
            case 'time':
                return <TimeField {...commonProps} />
            case 'datetime':
                return <DateTimeField {...commonProps} />
            case 'dropdown':
                return <DropdownField {...commonProps} />
            case 'radio':
                return <RadioField {...commonProps} />
            case 'checkbox':
                return <CheckboxField {...commonProps} />
            case 'rating':
                return <RatingField {...commonProps} />
            case 'file':
                return <FileField {...commonProps} maxSize={formData.settings?.maxFileSize} />
            case 'image':
                return <ImageField {...commonProps} maxSize={formData.settings?.maxFileSize} />
            case 'video':
                return <VideoField {...commonProps} maxSize={formData.settings?.maxFileSize} />
            case 'audio':
                return <AudioField {...commonProps} maxSize={formData.settings?.maxFileSize} />
            case 'location':
                return <LocationField {...commonProps} />
            default:
                return (
                    <div className="text-red-600 text-sm">
                        Unknown field type: {field.fieldType}
                    </div>
                )
        }
    }

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitError(null)

        // Validate form
        const { isValid, errors: validationErrors } = validateForm(
            answers,
            formData.fields
        )

        if (!isValid) {
            setErrors(validationErrors)
            toast.error('Please fix the errors before submitting')

            // Scroll to first error
            const firstErrorField = Object.keys(validationErrors)[0]
            const errorElement = document.getElementById(firstErrorField)
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }

            return
        }

        // Check if location is required
        if (formData.settings?.requireLocation && !location) {
            try {
                await fetchLocation()
            } catch (err) {
                toast.error('Location is required. Please enable location access.')
                return
            }
        }

        // Stop timer
        stopTimer()
        console.log(qrData)

        // Prepare submission data
        const submissionData = {
            formId: formData.formId,
            qrCodeId: qrData?.qrCodeId || qrData || null,
            serviceId: formData.serviceId,
            orgId: formData.orgId,
            citizenEmail: null, // Anonymous for now
            citizenPhone: null,
            answers,
            location: location || null,
            metadata: {
                formVersion: '1.0',
                completionTime,
                deviceInfo,
            },
        }

        // Submit
        submitMutation.mutate(submissionData)
    }

    if (!formData) {
        return null
    }

    // Sort fields by order
    const sortedFields = [...formData.fields].sort((a, b) => a.order - b.order)

    return (
        <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {/* Progress Bar */}
            <FormProgress />

            {/* Submit Error */}
            <AnimatePresence>
                {submitError && (
                    <ErrorMessage
                        message={submitError}
                        onClose={() => setSubmitError(null)}
                    />
                )}
            </AnimatePresence>

            {/* Form Fields */}
            <div className="card space-y-8">
                {sortedFields.map((field, index) => (
                    <motion.div
                        key={field.fieldId}
                        id={field.fieldId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="pb-8 border-b border-gray-200 last:border-b-0 last:pb-0"
                    >
                        {renderField(field)}
                    </motion.div>
                ))}
            </div>

            {/* Submit Button */}
            <div className="card">
                <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    loading={submitMutation.isPending}
                    disabled={submitMutation.isPending}
                >
                    {formData.settings?.submitButtonText || 'Submit Feedback'}
                </Button>

                <p className="text-sm text-gray-500 text-center mt-4">
                    {formData.settings?.allowAnonymous
                        ? '✓ Your response is anonymous'
                        : '⚠️ Your response will be recorded'}
                </p>
            </div>
        </motion.form>
    )
}

export default FormRenderer
