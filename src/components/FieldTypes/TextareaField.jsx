import { useFormStore } from '../../store/formStore'
import Label from '../UI/Label'
import { validateField } from '../../utils/validation'
import { motion } from 'framer-motion'

const TextareaField = ({ field }) => {
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

            <textarea
                id={field.fieldId}
                value={answer || ''}
                onChange={handleChange}
                placeholder={field.placeholder}
                rows={5}
                maxLength={field.validation?.maxLength}
                className={`input resize-none ${error ? 'input-error' : ''}`}
            />

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}

            {field.validation?.maxLength && (
                <p className="text-xs text-gray-500 text-right">
                    {answer?.length || 0} / {field.validation.maxLength}
                </p>
            )}
        </motion.div>
    )
}

export default TextareaField
