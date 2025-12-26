import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

/**
 * Role Guard - Protect routes based on user role
 */
const RoleGuard = ({ children, allowedRoles = [] }) => {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
        return <Navigate to="/dashboard" replace />
    }

    return children
}

export default RoleGuard
