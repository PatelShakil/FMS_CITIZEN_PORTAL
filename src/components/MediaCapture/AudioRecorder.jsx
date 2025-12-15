import { useEffect } from 'react'
import { useMediaRecorder } from '../../hooks/useMediaRecorder'
import Button from '../UI/Button'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MicrophoneIcon,
    StopIcon,
    PlayIcon,
    PauseIcon,
    XMarkIcon,
    CheckIcon,
} from '@heroicons/react/24/outline'

const AudioRecorder = ({ onComplete, onClose }) => {
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
    } = useMediaRecorder('audio')

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

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
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="card"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                    {recordedBlob ? 'Audio Preview' : 'Record Audio'}
                </h3>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Recording Interface */}
            <div className="space-y-6">
                {/* Visual Feedback */}
                <div className="relative">
                    <div className="w-full aspect-video bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex flex-col items-center justify-center overflow-hidden">
                        {/* Animated Waveform */}
                        {isRecording && !isPaused && (
                            <motion.div className="flex items-center gap-1 mb-4">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            height: [20, 60, 20],
                                        }}
                                        transition={{
                                            duration: 0.8,
                                            repeat: Infinity,
                                            delay: i * 0.1,
                                        }}
                                        className="w-1 bg-primary-600 rounded-full"
                                    />
                                ))}
                            </motion.div>
                        )}

                        {/* Microphone Icon */}
                        <motion.div
                            animate={
                                isRecording && !isPaused
                                    ? { scale: [1, 1.1, 1] }
                                    : { scale: 1 }
                            }
                            transition={{
                                duration: 1.5,
                                repeat: isRecording && !isPaused ? Infinity : 0,
                            }}
                            className={`
                w-24 h-24 rounded-full flex items-center justify-center mb-4
                ${isRecording ? 'bg-red-600' : 'bg-primary-600'}
              `}
                        >
                            <MicrophoneIcon className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Timer */}
                        <div className="text-center">
                            {isRecording || recordedBlob ? (
                                <>
                                    <p className="text-4xl font-mono font-bold text-gray-900 mb-2">
                                        {formatTime(recordingTime)}
                                    </p>
                                    {isRecording && (
                                        <motion.p
                                            animate={{ opacity: [1, 0.5, 1] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className="text-sm text-primary-600 font-semibold"
                                        >
                                            {isPaused ? '⏸️ Paused' : '🔴 Recording...'}
                                        </motion.p>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-500">Press record to start</p>
                            )}
                        </div>
                    </div>

                    {/* Recording Status */}
                    <AnimatePresence>
                        {isRecording && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-full text-sm font-semibold"
                            >
                                <motion.div
                                    animate={{ opacity: [1, 0, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-2 h-2 bg-white rounded-full"
                                />
                                REC
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Audio Player (Preview) */}
                {recordedBlob && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-primary-50 rounded-lg"
                    >
                        <audio
                            src={URL.createObjectURL(recordedBlob)}
                            controls
                            className="w-full"
                        />
                    </motion.div>
                )}

                {/* Controls */}
                <div className="flex flex-col gap-3">
                    {!isRecording && !recordedBlob && (
                        <Button
                            variant="primary"
                            size="lg"
                            fullWidth
                            onClick={handleStartRecording}
                            icon={<MicrophoneIcon className="w-5 h-5" />}
                        >
                            Start Recording
                        </Button>
                    )}

                    {isRecording && (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant={isPaused ? 'primary' : 'secondary'}
                                size="lg"
                                fullWidth
                                onClick={isPaused ? resumeRecording : pauseRecording}
                                icon={
                                    isPaused ? (
                                        <PlayIcon className="w-5 h-5" />
                                    ) : (
                                        <PauseIcon className="w-5 h-5" />
                                    )
                                }
                            >
                                {isPaused ? 'Resume' : 'Pause'}
                            </Button>

                            <Button
                                variant="danger"
                                size="lg"
                                fullWidth
                                onClick={handleStopRecording}
                                icon={<StopIcon className="w-5 h-5" />}
                            >
                                Stop
                            </Button>
                        </div>
                    )}

                    {recordedBlob && (
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant="secondary"
                                size="lg"
                                fullWidth
                                onClick={handleRetake}
                                icon={<XMarkIcon className="w-5 h-5" />}
                            >
                                Retake
                            </Button>

                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                onClick={handleConfirm}
                                icon={<CheckIcon className="w-5 h-5" />}
                            >
                                Use Audio
                            </Button>
                        </div>
                    )}

                    <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}

export default AudioRecorder
