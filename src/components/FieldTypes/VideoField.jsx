import { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import { useFileUpload } from '../../hooks/useFileUpload'
import Label from '../UI/Label'
import Button from '../UI/Button'
import VideoRecorder from '../MediaCapture/VideoRecorder'
import { motion, AnimatePresence } from 'framer-motion'
import {
    VideoCameraIcon,
    FolderIcon,
    XMarkIcon,
    CloudArrowUpIcon // Add this icon
} from '@heroicons/react/24/outline'

const VideoField = ({ field, maxSize }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const clearError = useFormStore((state) => state.clearError)

    const { uploadFile, isUploading, uploadProgress } = useFileUpload()
    const [showRecorder, setShowRecorder] = useState(false)
    const [videoPreview, setVideoPreview] = useState(null)
    const [pendingFile, setPendingFile] = useState(null) // ✅ NEW: Store file before upload

    const allowedFormats = field.validation?.allowedFormats || ['mp4', 'webm', 'ogg']
    const fileSizeLimit = maxSize || 20971520 // 20MB default

    // ✅ FIXED: Separated upload logic
    const handleFileUpload = async (file) => {
        clearError(field.fieldId)

        try {
            const result = await uploadFile(file, allowedFormats, fileSizeLimit)
            setAnswer(field.fieldId, result.data?.url || result.data?.fileUrl)
            setPendingFile(null) // Clear pending file after upload
        } catch (err) {
            console.error('Upload error:', err)
            setVideoPreview(null)
            setPendingFile(null)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            clearError(field.fieldId)
            // Create preview
            const url = URL.createObjectURL(file)
            setVideoPreview(url)
            setPendingFile(file) // ✅ Store file, don't upload yet
        }
    }

    // ✅ FIXED: Don't upload immediately, just store for preview
    const handleRecordingComplete = (blob) => {
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' })

        // Create preview
        const url = URL.createObjectURL(file)
        setVideoPreview(url)
        setPendingFile(file) // ✅ Store file, don't upload yet
        setShowRecorder(false)
    }

    // ✅ NEW: Explicit upload action
    const handleUploadNow = () => {
        if (pendingFile) {
            handleFileUpload(pendingFile)
        }
    }

    const handleRemove = () => {
        setAnswer(field.fieldId, null)
        if (videoPreview) URL.revokeObjectURL(videoPreview)
        setVideoPreview(null)
        setPendingFile(null) // ✅ Clear pending file
        clearError(field.fieldId)
    }

    // ✅ NEW: Cancel preview without uploading
    const handleCancelPreview = () => {
        if (videoPreview) URL.revokeObjectURL(videoPreview)
        setVideoPreview(null)
        setPendingFile(null)
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
                {showRecorder ? (
                    <motion.div
                        key="recorder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <VideoRecorder
                            onComplete={handleRecordingComplete}
                            onClose={() => setShowRecorder(false)}
                        />
                    </motion.div>
                ) : pendingFile && !answer ? ( // ✅ NEW: Show preview with upload button
                    <motion.div
                        key="pending-preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="space-y-3"
                    >
                        {/* Video Preview */}
                        <div className="relative">
                            <video
                                src={videoPreview}
                                controls
                                className="w-full max-h-96 rounded-lg border-2 border-primary-200"
                            />
                            <Button
                                variant="danger"
                                size="sm"
                                type="button"
                                onClick={handleCancelPreview}
                                className="absolute top-2 right-2"
                                icon={<XMarkIcon className="w-5 h-5" />}
                            >
                                Cancel
                            </Button>
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

                        {/* ✅ NEW: Upload Now Button */}
                        {!isUploading && (
                            <Button
                                variant="primary"
                                fullWidth
                                type="button"
                                onClick={handleUploadNow}
                                icon={<CloudArrowUpIcon className="w-5 h-5" />}
                            >
                                Upload Now
                            </Button>
                        )}

                        <p className="text-xs text-gray-500 text-center">
                            Preview your video and click "Upload Now" to save
                        </p>
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
                            {/* Record Button */}
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowRecorder(true)}
                                icon={<VideoCameraIcon className="w-5 h-5" />}
                                disabled={isUploading}
                                type="button"
                            >
                                Record Video
                            </Button>

                            {/* Upload Button */}
                            <div className="relative">
                                <input
                                    id={`${field.fieldId}-file`}
                                    type="file"
                                    accept="video/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    fullWidth
                                    type="button"
                                    onClick={() => document.getElementById(`${field.fieldId}-file`).click()}
                                    icon={<FolderIcon className="w-5 h-5" />}
                                    disabled={isUploading}
                                >
                                    Choose Video
                                </Button>
                            </div>
                        </div>

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
                        <video
                            src={videoPreview || answer}
                            controls
                            className="w-full max-h-96 rounded-lg border-2 border-green-200"
                        />
                        <Button
                            variant="danger"
                            size="sm"
                            type="button"
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

export default VideoField
