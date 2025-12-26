import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Mail, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import Input from '@components/common/Input'
import Button from '@components/common/Button'
import CarLoader from '@components/loaders/CarLoader'
import { login } from '@features/auth/authSlice'
import { validateEmail, validatePassword } from '@utils/validation'
// using real backend login

/**
 * Login Page
 */
const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { loading, error } = useSelector(state => state.auth)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({})

    const handleChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }))
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Validate
        const emailError = validateEmail(formData.email)
        const passwordError = validatePassword(formData.password)

        if (emailError || passwordError) {
            setErrors({
                email: emailError,
                password: passwordError,
            })
            return
        }

        try {
            // Dispatch real login thunk which calls backend
            const resultAction = await dispatch(login(formData))

            if (login.fulfilled.match(resultAction)) {
                // on success navigate
                navigate('/dashboard')
            } else {
                const payload = resultAction.payload || resultAction.error
                setErrors({ general: payload?.message || payload?.data?.message || 'Login failed' })
            }
        } catch (err) {
            setErrors({ general: 'Login failed' })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg light:bg-light-bg px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="card">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-primary mb-2">DigiPark</h1>
                        <p className="text-dark-text-secondary light:text-light-text-secondary">
                            Sign in to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Username or Email"
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your username or email"
                            icon={Mail}
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            icon={Lock}
                            error={errors.password}
                        />

                        {errors.general && (
                            <div className="p-3 bg-error/10 border border-error rounded-lg">
                                <p className="text-sm text-error">{errors.general}</p>
                            </div>
                        )}

                        {error && (
                            <div className="p-3 bg-error/10 border border-error rounded-lg">
                                <p className="text-sm text-error">{error.message || 'Login failed'}</p>
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    {/* Demo Credentials */}
                    <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm font-medium text-dark-text-primary light:text-light-text-primary mb-2">
                            Demo Credentials:
                        </p>
                        <p className="text-xs text-dark-text-secondary light:text-light-text-secondary">
                            Admin: admin@digipark.com / admin123
                        </p>
                        <p className="text-xs text-dark-text-secondary light:text-light-text-secondary">
                            User: user@digipark.com / user123
                        </p>
                    </div>

                    {loading && (
                        <div className="mt-6">
                            <CarLoader message="Authenticating..." />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Login
