const Container = ({ children, className = '', maxWidth = 'lg' }) => {
    const maxWidths = {
        sm: 'max-w-2xl',
        md: 'max-w-4xl',
        lg: 'max-w-5xl',
        xl: 'max-w-7xl',
        full: 'max-w-full',
    }

    return (
        <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${maxWidths[maxWidth]} ${className}`}>
            {children}
        </div>
    )
}

export default Container
