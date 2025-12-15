const Label = ({ children, required = false, htmlFor, className = '' }) => {
    return (
        <label
            htmlFor={htmlFor}
            className={`label ${required ? 'label-required' : ''} ${className}`}
        >
            {children}
        </label>
    )
}

export default Label
