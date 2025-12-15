import { APP_CONFIG } from '../../config'
import { Link } from 'react-router-dom'

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        © {currentYear} <a href={"/"} className={"text-blue-500"}>{APP_CONFIG.APP_NAME}</a>. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        Empowering citizens to share their voice
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer
