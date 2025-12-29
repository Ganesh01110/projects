import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, ParkingSquare, Receipt, History, Settings, ChevronLeft, Warehouse } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleSidebar, toggleSidebarCollapsed, setSidebarOpen } from '@features/ui/uiSlice'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@hooks/useAuth'

/**
 * Sidebar Navigation Component
 */
const Sidebar = () => {
    const dispatch = useDispatch()
    const sidebarOpen = useSelector(state => state.ui.sidebarOpen)
    const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)
    const { hasRole } = useAuth()
    const location = useLocation()

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parking-lots', icon: ParkingSquare, label: 'Parking Lots' },
        { path: '/billing', icon: Receipt, label: 'Billing' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ]

    // Add admin item if user is admin
    if (hasRole('ADMIN')) {
        navItems.push({ path: '/admin', icon: Settings, label: 'Admin' })
        navItems.push({ path: '/admin/gate-control', icon: Warehouse, label: 'Gate Control' })
    }

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => dispatch(toggleSidebar())}
                        className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: sidebarOpen ? 0 : -280,
                    // Use recommended widths: expanded ~240, collapsed ~56
                    width: sidebarCollapsed ? 56 : 240,
                }}
                transition={{ type: 'spring', damping: 20 }}
                className="fixed left-0 top-0 h-full bg-dark-surface light:bg-light-surface border-r border-dark-border light:border-light-border z-30 lg:translate-x-0"
                style={{ willChange: 'transform, width', overflow: 'hidden', boxSizing: 'border-box' }}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className={`flex items-center justify-between ${sidebarCollapsed ? 'px-3 py-4' : 'p-6'} border-b border-dark-border light:border-light-border`}>
                        <h1 className={`text-2xl font-bold text-primary transition-all ${sidebarCollapsed ? 'opacity-0 w-0 overflow-hidden' : ''}`}>DigiPark</h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => dispatch(toggleSidebarCollapsed())}
                                aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                aria-expanded={!sidebarCollapsed}
                                title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                                className="hidden lg:inline-flex p-2 hover:bg-dark-bg light:hover:bg-light-bg rounded-lg transition-transform"
                            >
                                <ChevronLeft size={18} className={`${sidebarCollapsed ? 'rotate-180' : ''} transition-transform`} />
                            </button>

                            <button
                                onClick={() => dispatch(toggleSidebar())}
                                className="lg:hidden p-2 hover:bg-dark-bg light:hover:bg-light-bg rounded-lg"
                                aria-label="Close sidebar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto custom-scrollbar min-w-0">
                        {navItems.map(item => {
                            const active = location.pathname === item.path || location.pathname.startsWith(item.path)

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => {
                                        // Close mobile sidebar on selection
                                        if (window.innerWidth < 1024) dispatch(setSidebarOpen(false))
                                    }}
                                    className={`flex items-center ${sidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-4 py-3'} rounded-lg transition-all`}
                                >
                                    <div title={sidebarCollapsed ? item.label : undefined} className="flex items-center">
                                        <div className={`flex items-center justify-center rounded-full transition-colors ${active ? 'bg-primary text-dark-bg' : 'text-dark-text-secondary light:text-light-text-secondary hover:bg-dark-bg light:hover:bg-light-bg hover:text-primary'} ${sidebarCollapsed ? 'w-10 h-10' : 'w-9 h-9'}`}>
                                            <item.icon size={20} />
                                        </div>

                                        {!sidebarCollapsed && (
                                            <motion.span
                                                className="overflow-hidden whitespace-nowrap ml-3"
                                                initial={false}
                                                animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }}
                                                transition={{ duration: 0.16 }}
                                                style={{ display: 'inline-block' }}
                                            >
                                                {item.label}
                                            </motion.span>
                                        )}
                                    </div>
                                </NavLink>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-dark-border light:border-light-border">
                        <motion.p
                            className="text-xs text-dark-text-muted light:text-light-text-muted text-center"
                            initial={false}
                            animate={{ opacity: sidebarCollapsed ? 0 : 1, width: sidebarCollapsed ? 0 : 'auto' }}
                            transition={{ duration: 0.16 }}
                            style={{ display: 'inline-block', width: '100%' }}
                        >
                            DigiPark v1.0.0
                        </motion.p>
                    </div>
                </div>
            </motion.aside>

            {/* spacer removed: AppShell controls content margin-left now */}
        </>
    )
}

export default Sidebar
