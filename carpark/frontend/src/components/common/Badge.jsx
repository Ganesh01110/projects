import { SLOT_STATUS, SLOT_COLORS } from '@utils/constants'

/**
 * Badge Component for Slot Status
 */
const Badge = ({ status, children, className = '' }) => {
    const statusColors = {
        [SLOT_STATUS.AVAILABLE]: 'bg-status-available text-dark-bg',
        [SLOT_STATUS.RESERVED]: 'bg-status-reserved text-dark-bg',
        [SLOT_STATUS.OCCUPIED]: 'bg-status-occupied text-white',
        [SLOT_STATUS.OUT_OF_SERVICE]: 'bg-status-outOfService text-white',
    }

    const colorClass = statusColors[status] || 'bg-dark-surface text-dark-text-primary'

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClass} ${className}`}>
            {children || status}
        </span>
    )
}

export default Badge
