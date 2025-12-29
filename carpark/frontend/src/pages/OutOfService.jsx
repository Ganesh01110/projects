import { useNavigate } from 'react-router-dom'
import { AlertCircle, RefreshCw, Phone } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'

/**
 * Out of Service Page
 */
const OutOfService = () => {
    const navigate = useNavigate()

    const handleRetry = () => {
        window.location.reload()
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg light:bg-light-bg px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center max-w-md"
            >
                {/* Broken Car Illustration */}
                <div className="mb-8">
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                        className="text-8xl mb-4"
                    >
                        🚧
                    </motion.div>

                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-error/10 mb-4">
                        <AlertCircle size={48} className="text-error" />
                    </div>
                </div>

                {/* Message */}
                <h1 className="text-3xl font-bold text-dark-text-primary light:text-light-text-primary mb-4">
                    Out of Service
                </h1>

                <p className="text-dark-text-secondary light:text-light-text-secondary mb-8">
                    This parking area is currently out of service. We're working to get it back online as soon as possible.
                </p>

                {/* Status Info */}
                <div className="card mb-8 text-left">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="w-2 h-2 bg-error rounded-full mt-2"></div>
                        <div>
                            <p className="text-sm font-medium text-dark-text-primary light:text-light-text-primary">
                                Service Status: Offline
                            </p>
                            <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                Last updated: Just now
                            </p>
                        </div>
                    </div>

                    <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                        Our team has been notified and is working on resolving the issue. Please try again later or contact support if the problem persists.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="primary"
                        onClick={handleRetry}
                        icon={RefreshCw}
                    >
                        Retry
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate('/dashboard')}
                    >
                        Go to Dashboard
                    </Button>
                </div>

                {/* Contact Support */}
                <div className="mt-8 pt-8 border-t border-dark-border light:border-light-border">
                    <p className="text-sm text-dark-text-muted light:text-light-text-muted mb-3">
                        Need immediate assistance?
                    </p>
                    <Button
                        variant="ghost"
                        icon={Phone}
                        className="text-primary"
                    >
                        Contact Support
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default OutOfService
