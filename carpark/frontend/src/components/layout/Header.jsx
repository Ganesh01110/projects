import { Moon, Sun, Bell, User, Menu } from 'lucide-react'
import { useTheme } from '@hooks/useTheme'
import { useAuth } from '@hooks/useAuth'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar, setSidebarOpen, setSidebarCollapsed } from '@features/ui/uiSlice'

/**
 * Header Component with Theme Toggle
 */
const Header = () => {
    const { theme, toggleTheme, isDark } = useTheme()
    const { user, logout } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    const dispatch = useDispatch()
    const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)
    const sidebarOpen = useSelector(state => state.ui.sidebarOpen)

    const onMenuClick = () => {
        // Desktop: expand sidebar (set collapsed = false)
        if (window.innerWidth >= 1024) {
            dispatch(setSidebarCollapsed(false))
        } else {
            // Mobile: toggle off-canvas sidebar
            dispatch(setSidebarOpen(!sidebarOpen))
        }
    }

    return (
        <header className="sticky top-0 z-30 bg-dark-bg/80 light:bg-light-bg/80 backdrop-blur-md border-b border-dark-border light:border-light-border">
            <div className="flex items-center justify-between px-6 py-[10px]">
                {/* Left: Menu + Logo/Title */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={onMenuClick}
                        aria-label="Toggle sidebar"
                        title="Toggle sidebar"
                        className="p-2 rounded-lg bg-dark-surface light:bg-light-surface hover:bg-primary/10 transition-colors"
                    >
                        <Menu size={20} className="text-primary" />
                    </button>

                    <h1 className="text-xl font-bold text-dark-text-primary light:text-light-text-primary">
                        DigiPark
                    </h1>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2 rounded-lg bg-dark-surface light:bg-light-surface hover:bg-primary/10 transition-colors"
                        aria-label="Toggle theme"
                    >
                        {isDark ? (
                            <Sun size={20} className="text-primary" />
                        ) : (
                            <Moon size={20} className="text-primary" />
                        )}
                    </motion.button>

                    {/* Notifications */}
                    {user && (
                        <button className="p-2 rounded-lg bg-dark-surface light:bg-light-surface hover:bg-primary/10 transition-colors relative">
                            <Bell size={20} className="text-dark-text-secondary light:text-light-text-secondary" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
                        </button>
                    )}

                    {/* User Profile */}
                    {user && (
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 p-2 rounded-lg bg-dark-surface light:bg-light-surface hover:bg-primary/10 transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-dark-bg font-semibold">
                                    {user.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-sm font-medium text-dark-text-primary light:text-light-text-primary hidden md:block">
                                    {user.name}
                                </span>
                            </button>

                            {/* Dropdown Menu */}
                            {showUserMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-48 bg-dark-surface light:bg-light-surface border border-dark-border light:border-light-border rounded-lg shadow-lg overflow-hidden"
                                >
                                    <div className="p-3 border-b border-dark-border light:border-light-border">
                                        <p className="text-sm font-medium text-dark-text-primary light:text-light-text-primary">
                                            {user.name}
                                        </p>
                                        <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                            {user.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full px-3 py-2 text-left text-sm text-error hover:bg-dark-bg light:hover:bg-light-bg transition-colors"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header
