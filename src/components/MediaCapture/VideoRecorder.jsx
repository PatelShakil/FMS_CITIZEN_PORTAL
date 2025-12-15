import { useState, useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import { useMediaRecorder } from '../../hooks/useMediaRecorder'
import Button from '../UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    VideoCameraIcon,
    StopIcon,
    PlayIcon,
    PauseIcon,
    XMarkIcon,
    CheckIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const VideoRecorder = ({ onComplete, onClose }) => {
    const webcamRef = useRef(null)
    const [facingMode, setFacingMode] = useState('user')
    const [isPreview, setIsPreview] = useState(false)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isReady, setIsReady] = useState(false)

    const {
        isRecording,
        isPaused,
        recordedBlob,
        recordingTime,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        reset,
    } = useMediaRecorder('video')

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode,
    }

    useEffect(() => {
        if (recordedBlob) {
            const url = URL.createObjectURL(recordedBlob)
            setPreviewUrl(url)
            setIsPreview(true)

            return () => URL.revokeObjectURL(url)
        }
    }, [recordedBlob])

    const handleStartRecording = async () => {
        try {
            await startRecording()
        } catch (err) {
            console.error('Recording error:', err)
        }
    }

    const handleStopRecording = async () => {
        await stopRecording()
    }

    const handleConfirm = () => {
        if (recordedBlob) {
            onComplete(recordedBlob)
        }
    }

    const handleRetake = () => {
        reset()
        setIsPreview(false)
        setPreviewUrl(null)
    }

    const handleSwitchCamera = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-black/50">
                <div className="flex items-center gap-3">
                    <h3 className="text-white font-semibold text-lg">Record Video</h3>

                    {/* Recording Indicator */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0 }}
                                className="flex items-center gap-2"
                            >
                                <motion.div
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-3 h-3 bg-red-600 rounded-full"
                                />
                                <span className="text-white font-mono text-sm">
                  {formatTime(recordingTime)}
                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    onClick={onClose}
                    type="button"
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Video View */}
            <div className="flex-grow flex items-center justify-center relative overflow-hidden bg-black">
                {isPreview && previewUrl ? (
                    <video
                        src={previewUrl}
                        controls
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <>
                        <Webcam
                            ref={webcamRef}
                            audio={true}
                            muted={true}
                            videoConstraints={videoConstraints}
                            onUserMedia={() => setIsReady(true)}
                            onUserMediaError={(err) => {
                                console.error('Camera error:', err)
                                toast.error('Failed to access camera/microphone')
                            }}
                            className="w-full h-full object-cover"
                        />

                        {/* Loading */}
                        {!isReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                                <div className="text-center">
                                    <div className="spinner border-white/30 border-t-white mb-4" />
                                    <p className="text-white">Loading camera...</p>
                                </div>
                            </div>
                        )}

                        {/* Recording Overlay */}
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute inset-0 pointer-events-none"
                            >
                                <div className="w-full h-full border-4 border-red-600 animate-pulse" />
                            </motion.div>
                        )}
                    </>
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-black/50 safe-area-inset">
                {isPreview ? (
                    <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRetake}
                            type="button"
                            icon={<XMarkIcon className="w-5 h-5" />}
                        >
                            Retake
                        </Button>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleConfirm}
                            type="button"
                            icon={<CheckIcon className="w-5 h-5" />}
                        >
                            Use Video
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {/* Switch Camera */}
                        {!isRecording && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleSwitchCamera}
                                type="button"
                                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                                disabled={!isReady}
                            >
                                <ArrowPathIcon className="w-6 h-6" />
                            </motion.button>
                        )}

                        {/* Record/Stop Button */}
                        {!isRecording ? (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleStartRecording}
                                disabled={!isReady}
                                type="button"
                                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                <VideoCameraIcon className="w-10 h-10 text-white" />
                            </motion.button>
                        ) : (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleStopRecording}
                                type="button"
                                className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                            >
                                <StopIcon className="w-10 h-10 text-white" />
                            </motion.button>
                        )}

                        {/* Pause/Resume */}
                        {isRecording && (
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={isPaused ? resumeRecording : pauseRecording}
                                type="button"
                                className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                {isPaused ? (
                                    <PlayIcon className="w-6 h-6" />
                                ) : (
                                    <PauseIcon className="w-6 h-6" />
                                )}
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default VideoRecorder
