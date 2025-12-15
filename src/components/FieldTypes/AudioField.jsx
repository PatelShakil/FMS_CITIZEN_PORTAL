import { useState } from 'react'
import { useFormStore } from '../../store/formStore'
import { useFileUpload } from '../../hooks/useFileUpload'
import Label from '../UI/Label'
import Button from '../UI/Button'
import AudioRecorder from '../MediaCapture/AudioRecorder'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MicrophoneIcon,
    MusicalNoteIcon,
    XMarkIcon,
    PlayIcon
} from '@heroicons/react/24/outline'

const AudioField = ({ field, maxSize }) => {
    const answer = useFormStore((state) => state.getAnswer(field.fieldId))
    const setAnswer = useFormStore((state) => state.setAnswer)
    const error = useFormStore((state) => state.errors[field.fieldId])
    const clearError = useFormStore((state) => state.clearError)

    const { uploadFile, isUploading, uploadProgress } = useFileUpload()
    const [showRecorder, setShowRecorder] = useState(false)
    const [audioPreview, setAudioPreview] = useState(null)

    const allowedFormats = field.validation?.allowedFormats || ['mp3', 'wav', 'ogg', 'webm']
    const fileSizeLimit = maxSize || 10485760 // 10MB default

    const handleFileUpload = async (file) => {
        clearError(field.fieldId)

        // Create preview
        const url = URL.createObjectURL(file)
        setAudioPreview(url)

        try {
            const result = await uploadFile(file, allowedFormats, fileSizeLimit)
            setAnswer(field.fieldId, result.data?.url || result.data?.fileUrl)
        } catch (err) {
            console.error('Upload error:', err)
            setAudioPreview(null)
        }
    }

    const handleFileChange = (e) => {
        const file = e.target.files?.[0]
        if (file) handleFileUpload(file)
    }

    const handleRecordingComplete = (blob) => {
        const file = new File([blob], `audio-${Date.now()}.webm`, { type: 'audio/webm' })
        handleFileUpload(file)
        setShowRecorder(false)
    }

    const handleRemove = () => {
        setAnswer(field.fieldId, null)
        if (audioPreview) URL.revokeObjectURL(audioPreview)
        setAudioPreview(null)
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
                        <AudioRecorder
                            onComplete={handleRecordingComplete}
                            onClose={() => setShowRecorder(false)}
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
                            {/* Record Button */}
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => setShowRecorder(true)}
                                icon={<MicrophoneIcon className="w-5 h-5" />}
                                disabled={isUploading}
                            >
                                Record Audio
                            </Button>

                            {/* Upload Button */}
                            <div className="relative">
                                <input
                                    id={`${field.fieldId}-file`}
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileChange}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => document.getElementById(`${field.fieldId}-file`).click()}
                                    icon={<MusicalNoteIcon className="w-5 h-5" />}
                                    disabled={isUploading}
                                    loading={isUploading}
                                >
                                    Choose Audio
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
                        className="space-y-3"
                    >
                        <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                            <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center">
                                <PlayIcon className="w-6 h-6 text-white" />
                            </div>
                            <audio
                                src={audioPreview || answer}
                                controls
                                className="flex-grow"
                            />
                        </div>
                        <Button
                            variant="danger"
                            size="sm"
                            fullWidth
                            onClick={handleRemove}
                            icon={<XMarkIcon className="w-5 h-5" />}
                        >
                            Remove Audio
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

export default AudioField
