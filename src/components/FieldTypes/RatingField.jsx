import { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import Label from '../UI/Label'
import { validateField } from '../../utils/validation'
import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const RatingField = ({ field }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const setError = useFormStore((state) => state.setError)
    const clearError = useFormStore((state) => state.clearError)

    const [hoverRating, setHoverRating] = useState(0)

    const maxRating = field.validation?.max || 5

    const handleClick = (rating) => {
        setAnswer(field.fieldId, rating)

        const errors = validateField(rating, field.validation, field.fieldType)
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
            className="space-y-3"
        >
            <Label required={field.required}>{field.fieldLabel}</Label>

            <div className="flex items-center gap-2">
                {[...Array(maxRating)].map((_, index) => {
                    const rating = index + 1
                    const isFilled = rating <= (hoverRating || answer || 0)

                    return (
                        <motion.button
                            key={rating}
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleClick(rating)}
                            onMouseEnter={() => setHoverRating(rating)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none"
                        >
                            <StarIcon
                                className={`w-10 h-10 transition-colors ${
                                    isFilled
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                }`}
                            />
                        </motion.button>
                    )
                })}

                {answer && (
                    <span className="ml-2 text-lg font-semibold text-gray-700">
            {answer} / {maxRating}
          </span>
                )}
            </div>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default RatingField
