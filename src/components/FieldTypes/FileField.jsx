import { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import { useFileUpload } from '../../hooks/useFileUpload'
import Label from '../UI/Label'
import Button from '../UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    DocumentIcon,
    ArrowUpTrayIcon,
    XMarkIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline'

const FileField = ({ field, maxSize }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const clearError = useFormStore((state) => state.clearError)

    const { uploadFile, isUploading, uploadProgress } = useFileUpload()
    const [fileName, setFileName] = useState(null)

    const allowedFormats = field.validation?.allowedFormats || []
    const fileSizeLimit = maxSize || 10485760 // 10MB default

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        clearError(field.fieldId)
        setFileName(file.name)

        try {
            const result = await uploadFile(file, allowedFormats, fileSizeLimit)

            // Store the file URL in answers
            setAnswer(field.fieldId, result.data?.url || result.data?.fileUrl)
        } catch (err) {
            console.error('Upload error:', err)
            setFileName(null)
        }
    }

    const handleRemove = () => {
        setAnswer(field.fieldId, null)
        setFileName(null)
        clearError(field.fieldId)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            <Label required={field.required}>{field.fieldLabel}</Label>

            {!answer ? (
                <div className="relative">
                    <input
                        id={field.fieldId}
                        type="file"
                        accept={allowedFormats.map(f => `.${f}`).join(',')}
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className=""
                    />

                    <label
                        htmlFor={field.fieldId}
                        className={`
              flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl
              transition-all cursor-pointer
              ${isUploading ? 'border-primary-300 bg-primary-50' : 'border-gray-300 hover:border-primary-500 bg-gray-50'}
            `}
                    >
                        {isUploading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center"
                            >
                                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-primary-600 font-semibold mb-2">
                                    Uploading... {uploadProgress}%
                                </p>
                                <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-primary-600"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <>
                                <ArrowUpTrayIcon className="w-12 h-12 text-gray-400 mb-3" />
                                <p className="text-gray-700 font-semibold mb-1">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-sm text-gray-500">
                                    {allowedFormats.length > 0
                                        ? `Allowed: ${allowedFormats.join(', ').toUpperCase()}`
                                        : 'Any file type'}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Max size: {(fileSizeLimit / 1048576).toFixed(1)}MB
                                </p>
                            </>
                        )}
                    </label>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 bg-green-50 border-2 border-green-200 rounded-lg"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-green-900">
                                {fileName || 'File uploaded'}
                            </p>
                            <p className="text-xs text-green-600">Upload successful</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRemove}
                        icon={<XMarkIcon className="w-5 h-5" />}
                    >
                        Remove
                    </Button>
                </motion.div>
            )}

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default FileField
