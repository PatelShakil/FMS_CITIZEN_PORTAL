import { useFormStore } from '../../store/formStore'
import Label from '../UI/Label'
import { validateField } from '../../utils/validation'
import { motion } from 'framer-motion'
import { EnvelopeIcon } from '@heroicons/react/24/outline'

const EmailField = ({ field }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const setError = useFormStore((state) => state.setError)
    const clearError = useFormStore((state) => state.clearError)

    const handleChange = (e) => {
        const value = e.target.value
        setAnswer(field.fieldId, value)

        const errors = validateField(value, field.validation, field.fieldType)
        if (errors.length > 0) {
            setError(field.fieldId, errors[0])
        } else {
            clearError(field.fieldId)
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
        >
            <Label required={field.required} htmlFor={field.fieldId}>
                {field.fieldLabel}
            </Label>

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>

                <input
                    id={field.fieldId}
                    type="email"
                    value={answer || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder || 'example@email.com'}
                    className={`input pl-10 ${error ? 'input-error' : ''}`}
                />
            </div>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default EmailField
