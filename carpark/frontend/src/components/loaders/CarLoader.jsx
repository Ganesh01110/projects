import { motion } from 'framer-motion'
import { Car } from 'lucide-react'

/**
 * Car Loader Animation
 */
const CarLoader = ({ message = 'Loading...' }) => {
    return (
        <div className="flex flex-col items-center justify-center py-12">
            {/* Dashed Road */}
            <div className="relative w-64 h-1 bg-dark-border light:bg-light-border rounded-full overflow-hidden mb-8">
                <motion.div
                    className="absolute top-0 left-0 h-full w-12 bg-primary"
                    animate={{
                        x: ['-100%', '400%'],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </div>

            {/* Animated Car */}
            <motion.div
                animate={{
                    x: [-20, 20, -20],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
                className="text-primary"
            >
                <Car size={48} />
            </motion.div>

            {/* Message */}
            {message && (
                <p className="mt-6 text-dark-text-secondary light:text-light-text-secondary text-sm">
                    {message}
                </p>
            )}
        </div>
    )
}

export default CarLoader
