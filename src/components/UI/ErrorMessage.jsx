import { motion } from 'framer-motion'
import { XCircleIcon } from '@heroicons/react/24/solid'

const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
            <XCircleIcon className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-800 flex-grow">{message}</p>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-red-600 hover:text-red-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            )}
        </motion.div>
    )
}

export default ErrorMessage
