import { forwardRef } from 'react'

const Input = forwardRef(
    (
        {
            label,
            error,
            helpText,
            required = false,
            fullWidth = true,
            icon = null,
            className = '',
            ...props
        },
        ref
    ) => {
        const inputClasses = `
      ${fullWidth ? 'w-full' : ''}
      ${icon ? 'pl-10' : 'px-4'}
      py-3 
      border 
      ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'}
      rounded-lg 
      focus:ring-2 
      focus:border-transparent 
      transition-all 
      duration-200 
      text-base
      placeholder:text-gray-400
      ${className}
    `

        return (
            <div className={fullWidth ? 'w-full' : ''}>
                {label && (
                    <label className={`label ${required ? 'label-required' : ''}`}>
                        {label}
                    </label>
                )}

                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            {icon}
                        </div>
                    )}

                    <input ref={ref} className={inputClasses} {...props} />
                </div>

                {error && <p className="error-text">{error}</p>}
                {helpText && !error && <p className="help-text">{helpText}</p>}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
