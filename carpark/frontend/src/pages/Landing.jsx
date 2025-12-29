import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, TrendingUp, Users } from 'lucide-react'
import Button from '@components/common/Button'

/**
 * Landing Page (Before Login)
 */
const Landing = () => {
    const navigate = useNavigate()

    const features = [
        { icon: CheckCircle, title: 'Real-time Availability', description: 'See available slots instantly' },
        { icon: TrendingUp, title: 'Smart Billing', description: 'Transparent pricing with discounts' },
        { icon: Users, title: 'Multi-lot Support', description: 'Access parking across multiple locations' },
    ]

    const stats = [
        { value: '99%', label: 'Accuracy rate used by our system' },
        { value: '570k+', label: 'Users who are actively using the application' },
    ]

    return (
        <div className="min-h-screen bg-dark-bg light:bg-light-bg">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-6 py-20 lg:py-32">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <h1 className="text-4xl lg:text-6xl font-bold text-dark-text-primary light:text-light-text-primary mb-6">
                                Find Your Perfect Space{' '}
                                <span className="text-primary">Instantly Nearby</span>
                            </h1>

                            <p className="text-lg text-dark-text-secondary light:text-light-text-secondary mb-8">
                                Easily discover nearby parking for all vehicles.
                                Use real-time—all just for you!
                            </p>

                            <div className="flex gap-4">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    onClick={() => navigate('/login')}
                                    icon={ArrowRight}
                                >
                                    Get Started
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={() => navigate('/login')}
                                >
                                    View Demo
                                </Button>
                            </div>

                            {/* Features List */}
                            <div className="mt-8 flex flex-wrap gap-6">
                                <div className="flex items-center gap-2 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span>No paperwork</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span>24/7 support system</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                    <CheckCircle size={16} className="text-primary" />
                                    <span>Fast in 2 days</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: Image/Illustration */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative w-full h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        y: [0, -20, 0],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="text-9xl"
                                >
                                    🚗
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-dark-surface light:bg-light-surface">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <h2 className="text-6xl font-bold text-primary mb-4">{stat.value}</h2>
                                <p className="text-dark-text-secondary light:text-light-text-secondary">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-dark-text-primary light:text-light-text-primary mb-12">
                        THE SOLUTION TO YOUR PARKING PROBLEMS
                    </h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="card text-center hover:border-primary"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                    <feature.icon size={32} className="text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold text-dark-text-primary light:text-light-text-primary mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-dark-text-secondary light:text-light-text-secondary">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 border-t border-dark-border light:border-light-border">
                <div className="container mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-primary mb-4">DIGIPARK</h3>
                            <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                                Smart parking solution for modern cities
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-dark-text-primary light:text-light-text-primary mb-4">ACCESS</h4>
                            <ul className="space-y-2 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                <li>About Us</li>
                                <li>Features</li>
                                <li>Pricing</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-dark-text-primary light:text-light-text-primary mb-4">CONTACT/SUPPORT</h4>
                            <ul className="space-y-2 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                <li>Help Center</li>
                                <li>Contact Us</li>
                                <li>Privacy Policy</li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-dark-border light:border-light-border text-center text-sm text-dark-text-muted light:text-light-text-muted">
                        © 2025 DigiPark. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Landing
