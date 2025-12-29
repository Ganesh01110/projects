import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import { useDispatch, useSelector } from 'react-redux'
import { setSidebarCollapsed } from '@features/ui/uiSlice'
import { useEffect, useState, useRef } from 'react'

// Module-scoped guard to prevent duplicate profile fetches across StrictMode remounts
let profileFetchedGlobal = false
import { fetchProfile } from '@features/auth/authSlice'

/**
 * App Shell - Main Layout Wrapper
 */
const AppShell = () => {
    const dispatch = useDispatch()
    const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)

    const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true)

    useEffect(() => {
        const onResize = () => setIsDesktop(window.innerWidth >= 1024)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    useEffect(() => {
        // Try to fetch current user profile on app shell mount.
        // Use a module-scoped flag so remounts (React StrictMode/HMR) do not re-dispatch.
        if (!profileFetchedGlobal) {
            profileFetchedGlobal = true
            // Helpful console log for debugging repeated requests
            // eslint-disable-next-line no-console
            console.log('AppShell: dispatching fetchProfile()')
            dispatch(fetchProfile())
        } else {
            // eslint-disable-next-line no-console
            console.log('AppShell: fetchProfile already dispatched previously')
        }
    }, [dispatch])

    const sidebarWidth = sidebarCollapsed ? 56 : 240

    const onMainClick = () => {
        // On desktop, clicking main content should collapse the sidebar (icon-only)
        if (isDesktop && !sidebarCollapsed) {
            dispatch(setSidebarCollapsed(true))
        }
    }

    // Apply margin-left on desktop only to avoid layout shift on mobile
    const contentStyle = {
        marginLeft: isDesktop ? `${sidebarWidth}px` : 0,
        transition: 'margin-left 240ms cubic-bezier(.4,0,.2,1)',
    }

    return (
        <div className="min-h-screen bg-dark-bg light:bg-light-bg">
            <Sidebar />

            <div className="flex flex-col min-h-screen" style={contentStyle}>
                <Header />

                <main className="flex-1 p-6" onClick={onMainClick}>
                    <Outlet />
                </main>

                <footer className="py-4 px-6 border-t border-dark-border light:border-light-border">
                    <p className="text-sm text-dark-text-muted light:text-light-text-muted text-center">
                        © 2025 DigiPark. All rights reserved.
                    </p>
                </footer>
            </div>
        </div>
    )
}

export default AppShell
