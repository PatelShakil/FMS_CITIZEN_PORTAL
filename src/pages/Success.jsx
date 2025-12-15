import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Button from '../components/UI/Button'
import { useFormStore } from '../store/formStore'
import { useEffect } from 'react'

const Success = () => {
    const navigate = useNavigate()
    const formData = useFormStore((state) => state.formData)
    const resetForm = useFormStore((state) => state.resetForm)

    const successMessage = formData?.settings?.successMessage ||
        'Thank you for your feedback! We will review it shortly.'

    const redirectUrl = formData?.settings?.redirectUrl

    useEffect(() => {
        // Auto-redirect after 5 seconds if URL provided
        if (redirectUrl) {
            const timer = setTimeout(() => {
                window.location.href = redirectUrl
            }, 5000)

            return () => clearTimeout(timer)
        }
    }, [redirectUrl])

    const handleNewFeedback = () => {
        resetForm()
        navigate('/')
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-white to-green-50">
            <Header minimal />

            <main className="flex-grow flex items-center justify-center">
                <Container maxWidth="md" className="py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="card text-center"
                    >
                        {/* Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6"
                        >
                            <CheckCircleIcon className="w-16 h-16 text-green-600" />
                        </motion.div>

                        {/* Success Message */}
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
                        >
                            Feedback Submitted!
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-600 mb-8 max-w-md mx-auto"
                        >
                            {successMessage}
                        </motion.p>

                        {/* Confetti Animation */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-6xl mb-8"
                        >
                            🎉
                        </motion.div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Button onClick={handleNewFeedback} size="lg">
                                Submit Another Feedback
                            </Button>

                            {redirectUrl && (
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    onClick={() => (window.location.href = redirectUrl)}
                                >
                                    Go to Website
                                </Button>
                            )}
                        </motion.div>

                        {redirectUrl && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-sm text-gray-500 mt-6"
                            >
                                Redirecting in 5 seconds...
                            </motion.p>
                        )}
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default Success
