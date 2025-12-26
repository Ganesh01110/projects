import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { logout as logoutAction } from '@features/auth/authSlice'

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
    const dispatch = useDispatch()
    const { user, isAuthenticated, loading, error } = useSelector(state => state.auth)

    const logout = useCallback(() => {
        dispatch(logoutAction())
    }, [dispatch])

    const hasRole = useCallback(
        role => {
            const userRoles = user?.roles || []
            return userRoles.includes(role) || userRoles.includes(`ROLE_${role}`)
        },
        [user]
    )

    const hasAnyRole = useCallback(
        roles => {
            const userRoles = user?.roles || []
            return roles.some(r => userRoles.includes(r) || userRoles.includes(`ROLE_${r}`))
        },
        [user]
    )

    return {
        user,
        isAuthenticated,
        loading,
        error,
        logout,
        hasRole,
        hasAnyRole,
    }
}

export default useAuth
