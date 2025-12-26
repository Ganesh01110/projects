import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'
import CarLoader from '@components/loaders/CarLoader'

/**
 * Auth Guard - Protect routes that require authentication
 */
const AuthGuard = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <CarLoader message="Checking authentication..." />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default AuthGuard
