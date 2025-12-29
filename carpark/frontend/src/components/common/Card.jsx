import { motion } from 'framer-motion'

/**
 * Reusable Card Component
 */
const Card = ({
    children,
    className = '',
    hover = false,
    onClick,
    ...props
}) => {
    const Component = onClick ? motion.div : 'div'

    const hoverProps = hover ? {
        whileHover: { y: -4, boxShadow: '0 0 30px rgba(164, 255, 7, 0.2)' },
        transition: { duration: 0.2 },
    } : {}

    return (
        <Component
            className={`card ${onClick ? 'cursor-pointer' : ''} ${className}`}
            onClick={onClick}
            {...(onClick ? hoverProps : {})}
            {...props}
        >
            {children}
        </Component>
    )
}

export default Card
