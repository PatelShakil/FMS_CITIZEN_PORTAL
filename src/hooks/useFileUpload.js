import { useState } from 'react'
import { uploadService } from '../api/uploadService'
import toast from 'react-hot-toast'

export const useFileUpload = () => {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedFile, setUploadedFile] = useState(null)
    const [error, setError] = useState(null)

    const uploadFile = async (file, allowedFormats = [], maxSizeBytes) => {
        setIsUploading(true)
        setUploadProgress(0)
        setError(null)

        try {
            // Validate file
            const validation = uploadService.validateFile(
                file,
                allowedFormats,
                maxSizeBytes
            )

            if (!validation.valid) {
                const errorMsg = validation.errors.join(', ')
                setError(errorMsg)
                toast.error(errorMsg)
                throw new Error(errorMsg)
            }

            // Upload file with progress
            const result = await uploadService.uploadFile(file, (progress) => {
                setUploadProgress(progress)
            })

            setUploadedFile(result)
            toast.success('File uploaded successfully')

            return result
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Upload failed'
            setError(errorMsg)
            toast.error(errorMsg)
            throw err
        } finally {
            setIsUploading(false)
        }
    }

    const uploadMultipleFiles = async (files, allowedFormats = [], maxSizeBytes) => {
        setIsUploading(true)
        setError(null)

        const results = []
        const errors = []

        for (let i = 0; i < files.length; i++) {
            try {
                const result = await uploadFile(files[i], allowedFormats, maxSizeBytes)
                results.push(result)
            } catch (err) {
                errors.push({ file: files[i].name, error: err.message })
            }
        }

        setIsUploading(false)

        if (errors.length > 0) {
            toast.error(`${errors.length} file(s) failed to upload`)
        }

        return { results, errors }
    }

    const reset = () => {
        setIsUploading(false)
        setUploadProgress(0)
        setUploadedFile(null)
        setError(null)
    }

    return {
        uploadFile,
        uploadMultipleFiles,
        isUploading,
        uploadProgress,
        uploadedFile,
        error,
        reset,
    }
}
