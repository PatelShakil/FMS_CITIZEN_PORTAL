export const validateField = (value, validation = {}, fieldType) => {
    const errors = []

    // Required validation
    if (validation.required) {
        if (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
        ) {
            errors.push('This field is required')
            return errors // Stop here if required and empty
        }
    }

    // If not required and empty, skip other validations
    if (!value && value !== 0) {
        return errors
    }

    // Type-specific validations
    switch (fieldType) {
        case 'text':
        case 'textarea':
            if (validation.minLength && value.length < validation.minLength) {
                errors.push(`Minimum ${validation.minLength} characters required`)
            }
            if (validation.maxLength && value.length > validation.maxLength) {
                errors.push(`Maximum ${validation.maxLength} characters allowed`)
            }
            if (validation.pattern) {
                const regex = new RegExp(validation.pattern)
                if (!regex.test(value)) {
                    errors.push('Invalid format')
                }
            }
            break

        case 'email':
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            if (!emailRegex.test(value)) {
                errors.push('Invalid email address')
            }
            break

        case 'phone':
            // Basic phone validation (adjust as needed)
            const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
            if (!phoneRegex.test(value)) {
                errors.push('Invalid phone number')
            }
            break

        case 'number':
            const numValue = parseFloat(value)
            if (isNaN(numValue)) {
                errors.push('Must be a valid number')
            } else {
                if (validation.min !== undefined && numValue < validation.min) {
                    errors.push(`Minimum value is ${validation.min}`)
                }
                if (validation.max !== undefined && numValue > validation.max) {
                    errors.push(`Maximum value is ${validation.max}`)
                }
            }
            break

        case 'date':
        case 'datetime':
            if (validation.minDate && new Date(value) < new Date(validation.minDate)) {
                errors.push(`Date must be after ${validation.minDate}`)
            }
            if (validation.maxDate && new Date(value) > new Date(validation.maxDate)) {
                errors.push(`Date must be before ${validation.maxDate}`)
            }
            break

        case 'checkbox':
            if (validation.minSelections && value.length < validation.minSelections) {
                errors.push(`Select at least ${validation.minSelections} options`)
            }
            if (validation.maxSelections && value.length > validation.maxSelections) {
                errors.push(`Select at most ${validation.maxSelections} options`)
            }
            break

        case 'file':
        case 'image':
        case 'video':
        case 'audio':
            // File validation is handled by uploadService
            break

        default:
            break
    }

    return errors
}

export const validateForm = (formData, fields) => {
    const errors = {}
    let isValid = true

    fields.forEach((field) => {
        const value = formData[field.fieldId]
        const fieldErrors = validateField(value, field.validation, field.fieldType)

        if (fieldErrors.length > 0) {
            errors[field.fieldId] = fieldErrors
            isValid = false
        }
    })

    return { isValid, errors }
}
