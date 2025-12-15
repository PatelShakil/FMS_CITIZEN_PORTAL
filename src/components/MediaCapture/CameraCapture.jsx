import { useState, useRef, useCallback } from 'react'
import Webcam from 'react-webcam'
import Button from '../UI/Button'
import { motion } from 'framer-motion'
import {
    CameraIcon,
    XMarkIcon,
    ArrowPathIcon,
    CheckIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const CameraCapture = ({ onCapture, onClose }) => {
    const webcamRef = useRef(null)
    const [capturedImage, setCapturedImage] = useState(null)
    const [facingMode, setFacingMode] = useState('user') // 'user' or 'environment'
    const [isReady, setIsReady] = useState(false)

    const videoConstraints = {
        width: 1280,
        height: 720,
        facingMode: facingMode,
    }

    const handleCapture = useCallback(() => {
        const imageSrc = webcamRef.current?.getScreenshot()
        if (imageSrc) {
            setCapturedImage(imageSrc)
            toast.success('Photo captured!')
        }
    }, [webcamRef])

    const handleRetake = () => {
        setCapturedImage(null)
    }

    const handleConfirm = () => {
        if (capturedImage) {
            // Convert base64 to blob
            fetch(capturedImage)
                .then((res) => res.blob())
                .then((blob) => {
                    onCapture(blob)
                })
        }
    }

    const handleSwitchCamera = () => {
        setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
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
                <h3 className="text-white font-semibold text-lg">Take Photo</h3>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Camera View */}
            <div className="flex-grow flex items-center justify-center relative overflow-hidden">
                {!capturedImage ? (
                    <>
                        <Webcam
                            ref={webcamRef}
                            audio={false}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            onUserMedia={() => setIsReady(true)}
                            onUserMediaError={(err) => {
                                console.error('Camera error:', err)
                                toast.error('Failed to access camera')
                            }}
                            className="w-full h-full object-cover"
                        />

                        {/* Camera Grid Overlay */}
                        {isReady && (
                            <div className="absolute inset-0 pointer-events-none">
                                {/* Rule of thirds grid */}
                                <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                                    {[...Array(9)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="border border-white/20"
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading */}
                        {!isReady && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black">
                                <div className="text-center">
                                    <div className="spinner border-white/30 border-t-white mb-4" />
                                    <p className="text-white">Loading camera...</p>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <img
                        src={capturedImage}
                        alt="Captured"
                        className="w-full h-full object-contain"
                    />
                )}
            </div>

            {/* Controls */}
            <div className="p-6 bg-black/50 safe-area-inset">
                {!capturedImage ? (
                    <div className="flex items-center justify-around max-w-md mx-auto">
                        {/* Switch Camera */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSwitchCamera}
                            className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            disabled={!isReady}
                        >
                            <ArrowPathIcon className="w-6 h-6" />
                        </motion.button>

                        {/* Capture Button */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={handleCapture}
                            disabled={!isReady}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                        >
                            <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center">
                                <CameraIcon className="w-8 h-8 text-white" />
                            </div>
                        </motion.button>

                        {/* Spacer */}
                        <div className="w-12 h-12" />
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-4 max-w-md mx-auto">
                        {/* Retake */}
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={handleRetake}
                            icon={<XMarkIcon className="w-5 h-5" />}
                        >
                            Retake
                        </Button>

                        {/* Confirm */}
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={handleConfirm}
                            icon={<CheckIcon className="w-5 h-5" />}
                        >
                            Use Photo
                        </Button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default CameraCapture
