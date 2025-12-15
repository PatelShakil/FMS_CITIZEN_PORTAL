import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Spinner from '../components/UI/Spinner'
import ErrorMessage from '../components/UI/ErrorMessage'
import FormRenderer from '../components/FormRenderer/FormRenderer'
import { useFormData } from '../hooks/useFormData'
import { useQRScan } from '../hooks/useQRScan'
import { useFormStore } from '../store/formStore'
import { getDeviceInfo } from '../utils/deviceInfo'
import {Helmet} from "react-helmet";

const FillForm = () => {
    const { qrCodeSlug } = useParams()
    const navigate = useNavigate()

    const setDeviceInfo = useFormStore((state) => state.setDeviceInfo)
    const startTimer = useFormStore((state) => state.startTimer)
    const resetForm = useFormStore((state) => state.resetForm)

    // Scan QR code
    const {
        qrData,
        isLoading: isQRLoading,
        isError: isQRError,
        error: qrError,
    } = useQRScan(qrCodeSlug)

    // Fetch form data
    const {
        formData,
        isLoading: isFormLoading,
        isError: isFormError,
        error: formError,
    } = useFormData(qrData)

    // Initialize form on mount
    useEffect(() => {
        // Reset form state
        resetForm()

        // Capture device info
        const deviceInfo = getDeviceInfo()
        setDeviceInfo(deviceInfo)

        // Start completion timer
        startTimer()

        return () => {
            // Cleanup on unmount
        }
    }, [qrCodeSlug, resetForm, setDeviceInfo, startTimer])

    // Handle QR scan errors
    useEffect(() => {
        if (isQRError) {
            const errorMsg = qrError?.response?.status === 404
                ? 'QR code not found or expired'
                : 'Failed to scan QR code'

            navigate('/error', {
                state: { message: errorMsg },
            })
        }
    }, [isQRError, qrError, navigate])

    // Handle form fetch errors
    useEffect(() => {
        if (isFormError) {
            const errorMsg = formError?.response?.status === 404
                ? 'Form not found or inactive'
                : 'Failed to load form'

            navigate('/error', {
                state: { message: errorMsg },
            })
        }
    }, [isFormError, formError, navigate])

    // Loading state
    if (isQRLoading || isFormLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header minimal />
                <main className="flex-grow flex items-center justify-center">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                    >
                        <Spinner size="xl" className="mb-4" />
                        <p className="text-lg text-gray-600">Loading form...</p>
                    </motion.div>
                </main>
                <Footer />
            </div>
        )
    }

    // Error state (fallback)
    if (isQRError || isFormError) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Header minimal />
                <main className="flex-grow flex items-center justify-center">
                    <Container maxWidth="md">
                        <ErrorMessage
                            message="Failed to load form. Please try again."
                        />
                    </Container>
                </main>
                <Footer />
            </div>
        )
    }

    // Success - render form
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Helmet>
                <title>{formData && formData?.formName} - BoloIndia</title>
            </Helmet>
            <Header />

            <main className="flex-grow py-8">
                <Container maxWidth="lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Form Info Header */}
                        <div className="card mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {formData?.formName}
                            </h1>
                            {formData?.formDescription && (
                                <p className="text-gray-600 text-lg">
                                    {formData.formDescription}
                                </p>
                            )}
                        </div>

                        {/* Form Renderer */}
                        <FormRenderer formData={formData} qrData={qrData} />
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default FillForm
