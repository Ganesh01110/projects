/**
 * Format currency
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount)
}

/**
 * Format date
 */
export const formatDate = (date, format = 'short') => {
    const options = {
        short: { month: 'short', day: 'numeric', year: 'numeric' },
        long: { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' },
        time: { hour: '2-digit', minute: '2-digit' },
    }

    if (!date) return 'N/A'
    const d = new Date(date)
    if (isNaN(d.getTime())) return 'Invalid Date'

    return new Intl.DateTimeFormat('en-US', options[format] || options.short).format(d)
}

/**
 * Format duration (in minutes)
 */
export const formatDuration = minutes => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) return `${mins}m`
    if (mins === 0) return `${hours}h`
    return `${hours}h ${mins}m`
}

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function
 */
export const debounce = (func, delay = 300) => {
    let timeoutId
    return (...args) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => func(...args), delay)
    }
}

/**
 * Get initials from name
 */
export const getInitials = name => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Generate random ID
 */
export const generateId = () => {
    return Math.random().toString(36).substring(2, 9)
}

/**
 * Check if object is empty
 */
export const isEmpty = obj => {
    return Object.keys(obj).length === 0
}

/**
 * Deep clone object
 */
export const deepClone = obj => {
    return JSON.parse(JSON.stringify(obj))
}
