import { motion } from 'framer-motion'
import { useFormStore } from '../../store/formStore'

const FormProgress = () => {
    const progress = useFormStore((state) => state.getProgress())

    return (
        <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progress</span>
                <span className="text-sm font-semibold text-primary-600">
          {progress}%
        </span>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                />
            </div>
        </div>
    )
}

export default FormProgress
