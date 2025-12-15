import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

// Pages
import Home from './pages/Home'
import FillForm from './pages/FillForm'
import Success from './pages/Success'
import ErrorPage from './pages/Error'
import NotFound from './pages/NotFound'

// Create QueryClient
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AnimatePresence mode="wait">
                    <Routes>
                        {/* Home Page */}
                        <Route path="/" element={<Home />} />

                        {/* Fill Form Page */}
                        <Route path="/fill/:qrCodeSlug" element={<FillForm />} />

                        {/* Success Page */}
                        <Route path="/success" element={<Success />} />

                        {/* Error Page */}
                        <Route path="/error" element={<ErrorPage />} />

                        {/* 404 Not Found */}
                        <Route path="/404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="/404" replace />} />
                    </Routes>
                </AnimatePresence>

                {/* Toast Notifications */}
                <Toaster
                    position="top-center"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: '#fff',
                            color: '#363636',
                            fontWeight: '500',
                            padding: '16px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        },
                        success: {
                            iconTheme: {
                                primary: '#10b981',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App
