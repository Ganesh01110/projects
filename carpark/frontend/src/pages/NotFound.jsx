import { useNavigate } from 'react-router-dom'
import { Home, AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'

/**
 * 404 Not Found Page
 */
const NotFound = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg light:bg-light-bg px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* 404 Icon */}
                <div className="mb-8">
                    <motion.div
                        animate={{
                            rotate: [0, 10, -10, 10, 0],
                        }}
                        transition={{
                            duration: 0.5,
                            repeat: Infinity,
                            repeatDelay: 3,
                        }}
                        className="inline-block"
                    >
                        <AlertTriangle size={80} className="text-primary" />
                    </motion.div>
                </div>

                {/* 404 Text */}
                <h1 className="text-8xl font-bold text-primary mb-4">404</h1>

                <h2 className="text-2xl font-semibold text-dark-text-primary light:text-light-text-primary mb-4">
                    Page Not Found
                </h2>

                <p className="text-dark-text-secondary light:text-light-text-secondary mb-8">
                    Oops! The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        onClick={() => navigate('/dashboard')}
                        icon={Home}
                    >
                        Go to Dashboard
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        Go Back
                    </Button>
                </div>

                {/* Animated Car */}
                <motion.div
                    animate={{
                        x: [-20, 20, -20],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                    className="mt-12 text-6xl"
                >
                    🚗
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NotFound
