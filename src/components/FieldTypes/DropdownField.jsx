import { useFormStore } from '../../store/formStore'
import Label from '../UI/Label'
import { validateField } from '../../utils/validation'
import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const DropdownField = ({ field }) => {
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
                <select
                    id={field.fieldId}
                    value={answer || ''}
                    onChange={handleChange}
                    className={`input appearance-none pr-10 ${error ? 'input-error' : ''}`}
                >
                    <option value="">
                        {field.placeholder || 'Select an option'}
                    </option>
                    {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>

                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                </div>
            </div>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default DropdownField
