import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Receipt, Clock, CreditCard } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '@components/common/Card'
import Badge from '@components/common/Badge'
import EmptyState from '@components/common/EmptyState'
import CarLoader from '@components/loaders/CarLoader'
import { fetchBillingHistory } from '@features/billing/billingSlice'
import { mockGetBillingHistory } from '@api/billingApi'
import { formatCurrency, formatDate, formatDuration } from '@utils/helpers'

/**
 * Billing History Page
 */
const BillingHistory = () => {
    const dispatch = useDispatch()
    const { history, loading } = useSelector(state => state.billing)

    useEffect(() => {
        // Fetch billing history (falls back to dummy data if backend unavailable)
        dispatch(fetchBillingHistory())
    }, [dispatch])

    if (loading) {
        return <CarLoader message="Loading billing history..." />
    }

    if (!history || history.length === 0) {
        return (
            <EmptyState
                icon={Receipt}
                title="No billing history"
                description="You don't have any parking sessions yet. Start parking to see your billing history here."
            />
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary light:text-light-text-primary mb-2">
                    Billing History
                </h1>
                <p className="text-dark-text-secondary light:text-light-text-secondary">
                    View your past parking sessions and payments
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Receipt size={24} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                                Total Spent
                            </p>
                            <p className="text-2xl font-bold text-dark-text-primary light:text-light-text-primary">
                                {formatCurrency((Array.isArray(history) ? history : []).reduce((sum, item) => sum + item.amount, 0))}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                            <Clock size={24} className="text-success" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                                Total Sessions
                            </p>
                            <p className="text-2xl font-bold text-dark-text-primary light:text-light-text-primary">
                                {history.length}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                            <CreditCard size={24} className="text-info" />
                        </div>
                        <div>
                            <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                                Avg. Duration
                            </p>
                            <p className="text-2xl font-bold text-dark-text-primary light:text-light-text-primary">
                                {formatDuration(Math.round((Array.isArray(history) ? history : []).reduce((sum, item) => sum + item.duration, 0) / (history?.length || 1)))}
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Billing History List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-dark-text-primary light:text-light-text-primary">
                    Recent Transactions
                </h2>

                {(Array.isArray(history) ? history : []).map((rawItem, index) => {
                    // Normalize data from backend structure (BillingRecord) or mock structure
                    const item = {
                        id: rawItem.id,
                        location: rawItem.location || rawItem.session?.slot?.parkingFloor?.parkingLot?.name || 'Unknown Location',
                        status: rawItem.status || (rawItem.paid ? 'PAID' : 'COMPLETED'),
                        slot: rawItem.slot || rawItem.session?.slot?.slotNumber || 'N/A',
                        amount: rawItem.amount,
                        date: rawItem.date || rawItem.createdAt || rawItem.session?.entryTime,
                        duration: rawItem.duration,
                    }

                    // Calculate duration if it's missing but we have session times
                    if (!item.duration && rawItem.session?.entryTime && rawItem.session?.exitTime) {
                        const entry = new Date(rawItem.session.entryTime)
                        const exit = new Date(rawItem.session.exitTime)
                        item.duration = Math.round((exit - entry) / 60000)
                    }

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card hover>
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-semibold text-dark-text-primary light:text-light-text-primary">
                                                {item.location}
                                            </h3>
                                            <Badge status="AVAILABLE">
                                                {item.status}
                                            </Badge>
                                        </div>

                                        <div className="flex flex-wrap gap-4 text-sm text-dark-text-secondary light:text-light-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Receipt size={14} />
                                                Slot {item.slot}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {formatDuration(item.duration || 0)}
                                            </span>
                                            <span>
                                                {formatDate(item.date, 'long')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-primary">
                                            {formatCurrency(item.amount)}
                                        </p>
                                        <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                            {item.duration > 0 ? formatCurrency(item.amount / (item.duration / 60)) : '$0.00'}/hr
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}

export default BillingHistory
