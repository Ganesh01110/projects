import { motion } from 'framer-motion'

/**
 * Reusable Button Component
 */
const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    className = '',
    icon: Icon,
    ...props
}) => {
    const baseClasses = 'btn inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-dark-bg',
        ghost: 'hover:bg-dark-surface hover:text-primary',
    }

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <motion.button
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {Icon && <Icon size={20} />}
            {children}
        </motion.button>
    )
}

export default Button
