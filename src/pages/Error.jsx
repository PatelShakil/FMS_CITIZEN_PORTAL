import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { XCircleIcon } from '@heroicons/react/24/solid'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Button from '../components/UI/Button'

const ErrorPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const errorMessage = location.state?.message || 'Something went wrong. Please try again.'

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-red-50">
            <Header minimal />

            <main className="flex-grow flex items-center justify-center">
                <Container maxWidth="md" className="py-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6"
                        >
                            <XCircleIcon className="w-16 h-16 text-red-600" />
                        </motion.div>

                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                            Oops! Something Went Wrong
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                            {errorMessage}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button onClick={() => navigate(-1)} variant="secondary" size="lg">
                                Go Back
                            </Button>
                            <Button onClick={() => navigate('/')} size="lg">
                                Go to Home
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default ErrorPage
