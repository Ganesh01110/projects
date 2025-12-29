import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

/**
 * Modal Component
 */
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    }

    // Close on Escape key
    useEffect(() => {
        const handleEscape = e => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`w-full ${sizeClasses[size]} bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border rounded-2xl shadow-2xl overflow-hidden`}
                        >
                            {/* Header */}
                            {title && (
                                <div className="flex items-center justify-between p-6 border-b border-dark-border light:border-light-border">
                                    <h2 className="text-xl font-semibold text-dark-text-primary light:text-light-text-primary">
                                        {title}
                                    </h2>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-dark-bg light:hover:bg-light-bg rounded-lg transition-colors"
                                    >
                                        <X size={20} className="text-dark-text-secondary light:text-light-text-secondary" />
                                    </button>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-6">
                                {children}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

export default Modal
