import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DollarSign, Activity, TrendingUp, Car } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '@components/common/Card'
import Button from '@components/common/Button'
import CarLoader from '@components/loaders/CarLoader'
import { fetchDashboardSummary } from '@features/dashboard/dashboardSlice'
import { formatCurrency } from '@utils/helpers'

/**
 * Dashboard Page
 */
const Dashboard = () => {
    const dispatch = useDispatch()
    const { summary, loading } = useSelector(state => state.dashboard)
    const { user } = useSelector(state => state.auth)

    useEffect(() => {
        // Fetch dashboard summary (falls back to dummy data if backend unavailable)
        dispatch(fetchDashboardSummary())
    }, [dispatch])

    // Defensive defaults in case `summary` is undefined
    const safeSummary = summary || { totalExpenses: 0, activeSessions: 0, occupancyRate: 0 }

    const stats = [
        {
            icon: DollarSign,
            label: user?.roles?.some(r => r === 'ADMIN' || r === 'ROLE_ADMIN') ? 'Total Revenue' : 'Total Expenses',
            value: formatCurrency(safeSummary.totalRevenue || safeSummary.totalExpenses || 0),
            color: 'text-primary',
            bgColor: 'bg-primary/10',
        },
        {
            icon: Activity,
            label: 'Active Sessions',
            value: safeSummary.activeSessions ?? 0,
            color: 'text-success',
            bgColor: 'bg-success/10',
        },
        {
            icon: TrendingUp,
            label: 'Occupancy Rate',
            value: `${safeSummary.occupancyRate ?? 0}%`,
            color: 'text-info',
            bgColor: 'bg-info/10',
        },
    ]

    if (loading) {
        return <CarLoader message="Loading dashboard..." />
    }

    return (
        <div className="space-y-6">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary light:text-light-text-primary mb-2">
                    Welcome back, {user?.name}!
                </h1>
                <p className="text-dark-text-secondary light:text-light-text-secondary">
                    Here's what's happening with your parking today
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card>
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                                    <stat.icon size={24} className={stat.color} />
                                </div>
                                <div>
                                    <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                                        {stat.label}
                                    </p>
                                    <p className="text-2xl font-bold text-dark-text-primary light:text-light-text-primary">
                                        {stat.value}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-8 text-center bg-gradient-to-br from-primary/10 to-transparent border-primary">
                    <Car size={48} className="mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-semibold text-dark-text-primary light:text-light-text-primary mb-2">
                        Find Parking
                    </h3>
                    <p className="text-dark-text-secondary light:text-light-text-secondary mb-4">
                        Discover available parking spots near you
                    </p>
                    <Button variant="primary" onClick={() => window.location.href = '/parking-lots'}>
                        Browse Parking Lots
                    </Button>
                </Card>

                <Card className="p-8">
                    <h3 className="text-lg font-semibold text-dark-text-primary light:text-light-text-primary mb-4">
                        Recent Activity
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-dark-bg light:bg-light-bg rounded-lg">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-dark-text-primary light:text-light-text-primary">
                                    Parked at Dubai Marina
                                </p>
                                <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                    2 hours ago
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-dark-bg light:bg-light-bg rounded-lg">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <div className="flex-1">
                                <p className="text-sm text-dark-text-primary light:text-light-text-primary">
                                    Payment completed
                                </p>
                                <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                    5 hours ago
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
