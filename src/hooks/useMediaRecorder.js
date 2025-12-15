import { useState, useRef, useCallback } from 'react'
import RecordRTC from 'recordrtc'
import toast from 'react-hot-toast'

export const useMediaRecorder = (type = 'audio') => {
    const [isRecording, setIsRecording] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const [recordedBlob, setRecordedBlob] = useState(null)
    const [recordingTime, setRecordingTime] = useState(0)
    const [error, setError] = useState(null)

    const recorderRef = useRef(null)
    const streamRef = useRef(null)
    const timerRef = useRef(null)

    const startRecording = useCallback(async () => {
        setError(null)

        try {
            // Get media stream
            const constraints = type === 'video'
                ? { video: true, audio: true }
                : { audio: true }

            const stream = await navigator.mediaDevices.getUserMedia(constraints)
            streamRef.current = stream

            // Create recorder
            const recorder = new RecordRTC(stream, {
                type: type === 'video' ? 'video' : 'audio',
                mimeType: type === 'video' ? 'video/webm' : 'audio/webm',
                bitsPerSecond: 128000,
            })

            recorderRef.current = recorder
            recorder.startRecording()
            setIsRecording(true)

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)

            toast.success('Recording started')
        } catch (err) {
            const errorMsg = err.name === 'NotAllowedError'
                ? 'Permission denied. Please allow access to your microphone/camera.'
                : 'Failed to start recording'

            setError(errorMsg)
            toast.error(errorMsg)
            throw err
        }
    }, [type])

    const pauseRecording = useCallback(() => {
        if (recorderRef.current && isRecording) {
            recorderRef.current.pauseRecording()
            setIsPaused(true)
            clearInterval(timerRef.current)
            toast('Recording paused', { icon: '⏸️' })
        }
    }, [isRecording])

    const resumeRecording = useCallback(() => {
        if (recorderRef.current && isPaused) {
            recorderRef.current.resumeRecording()
            setIsPaused(false)

            // Resume timer
            timerRef.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1)
            }, 1000)

            toast('Recording resumed', { icon: '▶️' })
        }
    }, [isPaused])

    const stopRecording = useCallback(() => {
        return new Promise((resolve) => {
            if (recorderRef.current && isRecording) {
                recorderRef.current.stopRecording(() => {
                    const blob = recorderRef.current.getBlob()
                    setRecordedBlob(blob)
                    setIsRecording(false)
                    setIsPaused(false)
                    clearInterval(timerRef.current)

                    // Stop all tracks
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((track) => track.stop())
                    }

                    toast.success('Recording stopped')
                    resolve(blob)
                })
            } else {
                resolve(null)
            }
        })
    }, [isRecording])

    const discardRecording = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop())
        }

        setIsRecording(false)
        setIsPaused(false)
        setRecordedBlob(null)
        setRecordingTime(0)
        clearInterval(timerRef.current)

        recorderRef.current = null
        streamRef.current = null

        toast('Recording discarded', { icon: '🗑️' })
    }, [])

    const reset = useCallback(() => {
        discardRecording()
        setError(null)
    }, [discardRecording])

    return {
        isRecording,
        isPaused,
        recordedBlob,
        recordingTime,
        error,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        discardRecording,
        reset,
    }
}
