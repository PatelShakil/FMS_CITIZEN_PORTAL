import { motion } from 'framer-motion'
import { APP_CONFIG } from '../../config'

const Header = ({ minimal = false }) => {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm"
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">B</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">
                                {APP_CONFIG.APP_NAME}
                            </h1>
                            {!minimal && (
                                <p className="text-xs text-gray-500">{APP_CONFIG.APP_TAGLINE}</p>
                            )}
                        </div>
                    </div>

                    {/* Right side (optional) */}
                    <div className="flex items-center gap-2">
                        {/* Future: Language switcher, help button, etc. */}
                    </div>
                </div>
            </div>
        </motion.header>
    )
}

export default Header
