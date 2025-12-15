import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Button from '../components/UI/Button'

const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <Header minimal />

            <main className="flex-grow flex items-center justify-center">
                <Container maxWidth="md" className="py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center justify-center w-32 h-32 bg-gray-100 rounded-full mb-6"
                        >
                            <QuestionMarkCircleIcon className="w-20 h-20 text-gray-400" />
                        </motion.div>

                        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900 mb-4">404</h1>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-4">
                            Page Not Found
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                            The page you're looking for doesn't exist or has been moved.
                        </p>

                        <Button onClick={() => navigate('/')} size="lg">
                            Back to Home
                        </Button>
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default NotFound
