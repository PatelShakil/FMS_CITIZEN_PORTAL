import { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import { useFileUpload } from '../../hooks/useFileUpload'
import Label from '../UI/Label'
import Button from '../UI/Button'
import CameraCapture from '../MediaCapture/CameraCapture'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CameraIcon,
    PhotoIcon,
    XMarkIcon
} from '@heroicons/react/24/outline'

const ImageField = ({ field, maxSize }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const clearError = useFormStore((state) => state.clearError)

    const { uploadFile, isUploading, uploadProgress } = useFileUpload()
    const [showCamera, setShowCamera] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)

    const allowedFormats = field.validation?.allowedFormats || ['jpg', 'jpeg', 'png', 'webp']
    const fileSizeLimit = maxSize || 5242880 // 5MB default

    const handleFileUpload = async (file) => {
        clearError(field.fieldId)

        // Create preview
        const reader = new FileReader()
        reader.onload = (e) => setImagePreview(e.target.result)
        reader.readAsDataURL(file)

        try {
            const result = await uploadFile(file, allowedFormats, fileSizeLimit)
            setAnswer(field.fieldId, result.data?.url || result.data?.fileUrl)
        } catch (err) {
            console.error('Upload error:', err)
            setImagePreview(null)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
    }

    const handleCameraCapture = (blob) => {
        const file = new File([blob], `camera-${Date.now()}.jpg`, { type: 'image/jpeg' })
        handleFileUpload(file)
        setShowCamera(false)
    }

    const handleRemove = () => {
        setAnswer(field.fieldId, null)
        setImagePreview(null)
        clearError(field.fieldId)
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
        >
            <Label required={field.required}>{field.fieldLabel}</Label>

            <AnimatePresence mode="wait">
                {showCamera ? (
                    <motion.div
                        key="camera"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <CameraCapture
                            onCapture={handleCameraCapture}
                            onClose={() => setShowCamera(false)}
                        />
                    </motion.div>
                ) : !answer ? (
                    <motion.div
                        key="upload"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {/* Upload Options */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Camera Button */}
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowCamera(true)}
                                icon={<CameraIcon className="w-5 h-5" />}
                                disabled={isUploading}
                            >
                                Take Photo
                            </Button>

                            {/* Gallery Button */}
                            <div className="relative">
                                <input
                                    id={`${field.fieldId}-file`}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => document.getElementById(`${field.fieldId}-file`).click()}
                                    icon={<PhotoIcon className="w-5 h-5" />}
                                    disabled={isUploading}
                                    loading={isUploading}
                                >
                                    Choose from Gallery
                                </Button>
                            </div>
                        </div>

                        {/* Upload Progress */}
                        {isUploading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="p-4 bg-primary-50 rounded-lg"
                            >
                                <p className="text-sm text-primary-600 font-semibold mb-2">
                                    Uploading... {uploadProgress}%
                                </p>
                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${uploadProgress}%` }}
                                        className="h-full bg-primary-600"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Info */}
                        <p className="text-xs text-gray-500 text-center">
                            Allowed: {allowedFormats.join(', ').toUpperCase()} • Max: {(fileSizeLimit / 1048576).toFixed(1)}MB
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative"
                    >
                        <img
                            src={imagePreview || answer}
                            alt="Uploaded"
                            className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleRemove}
                            className="absolute top-2 right-2"
                            icon={<XMarkIcon className="w-5 h-5" />}
                        >
                            Remove
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {field.helpText && !error && (
                <p className="help-text">{field.helpText}</p>
            )}

            {error && <p className="error-text">{error}</p>}
        </motion.div>
    )
}

export default ImageField
