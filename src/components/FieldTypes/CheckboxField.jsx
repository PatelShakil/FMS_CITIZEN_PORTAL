import { useFormStore } from '../../store/formStore'
import Label from '../UI/Label'
import { validateField } from '../../utils/validation'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'

const CheckboxField = ({ field }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId)) || []
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const setError = useFormStore((state) => state.setError)
    const clearError = useFormStore((state) => state.clearError)

    const handleChange = (value, checked) => {
        let newAnswer
        if (checked) {
            newAnswer = [...answer, value]
        } else {
            newAnswer = answer.filter((v) => v !== value)
        }

        setAnswer(field.fieldId, newAnswer)

        const errors = validateField(newAnswer, field.validation, field.fieldType)
        if (errors.length > 0) {
            setError(field.fieldId, errors[0])
        } else {
            clearError(field.fieldId)
        }
    }

    const isChecked = (value) => answer.includes(value)

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            <Label required={field.required}>{field.fieldLabel}</Label>

            <div className="space-y-3">
                {field.options?.map((option, index) => (
                    <motion.label
                        key={option.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`
              flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all
              ${
                            isChecked(option.value)
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                        }
            `}
                    >
                        <div className="relative">
                            <input
                                type="checkbox"
                                value={option.value}
                                checked={isChecked(option.value)}
                                onChange={(e) => handleChange(option.value, e.target.checked)}
                                className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                            />
                            {isChecked(option.value) && (
                                <CheckIcon className="w-4 h-4 text-white absolute top-0.5 left-0.5 pointer-events-none" />
                            )}
                        </div>
                        <span className="ml-3 text-gray-900 font-medium">
              {option.label}
            </span>
                    </motion.label>
                ))}
            </div>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default CheckboxField
