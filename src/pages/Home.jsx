import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import Container from '../components/Layout/Container'
import Button from '../components/UI/Button'
import { QrCodeIcon, ChatBubbleLeftRightIcon, SparklesIcon } from '@heroicons/react/24/outline'
import {Helmet} from "react-helmet";

const Home = () => {
    const navigate = useNavigate()

    const features = [
        {
            icon: <QrCodeIcon className="w-8 h-8" />,
            title: 'Scan QR Code',
            description: 'Simply scan any BoloIndia QR code to get started',
        },
        {
            icon: <ChatBubbleLeftRightIcon className="w-8 h-8" />,
            title: 'Share Feedback',
            description: 'Fill out dynamic forms with various field types',
        },
        {
            icon: <SparklesIcon className="w-8 h-8" />,
            title: 'Make a Difference',
            description: 'Your feedback helps improve services',
        },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary-50 via-white to-primary-50">
            <Helmet>
                <title>BoloIndia | Feedback Portal</title>
                <meta name="description" content="BoloIndia is a feedback portal for Bolo India services." />
            </Helmet>
            <Header />

            <main className="flex-grow">
                <Container className="py-12 sm:py-20">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-block mb-6"
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center shadow-2xl">
                                <span className="text-white font-bold text-5xl">B</span>
                            </div>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                            Welcome to <span className="text-primary-600">BoloIndia</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            Your voice matters! Share your feedback and help improve services in your community.
                        </p>

                        <Button
                            size="lg"
                            onClick={() => navigate('/fill/QR_48H1OFQU')}
                            className="shadow-2xl"
                        >
                            Try Demo Form
                        </Button>
                    </motion.div>

                    {/* Features Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.6 }}
                        className="grid md:grid-cols-3 gap-8 mb-16"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="card text-center hover:shadow-xl transition-shadow"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="card bg-gradient-to-r from-primary-500 to-primary-700 text-white text-center"
                    >
                        <h2 className="text-3xl font-bold mb-4">Ready to Share Your Feedback?</h2>
                        <p className="text-primary-100 mb-6 max-w-xl mx-auto">
                            Scan a QR code from any BoloIndia service point or use the link provided
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button variant="secondary" size="lg">
                                Learn More
                            </Button>
                            <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white/20">
                                Contact Support
                            </Button>
                        </div>
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    )
}

export default Home
