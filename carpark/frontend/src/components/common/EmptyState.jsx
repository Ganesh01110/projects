import { Inbox } from 'lucide-react'

/**
 * Empty State Component
 */
const EmptyState = ({
    icon: Icon = Inbox,
    title = 'No data found',
    description,
    action,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
            <div className="w-16 h-16 rounded-full bg-dark-surface light:bg-light-surface flex items-center justify-center mb-4">
                <Icon size={32} className="text-dark-text-muted light:text-light-text-muted" />
            </div>

            <h3 className="text-lg font-semibold text-dark-text-primary light:text-light-text-primary mb-2">
                {title}
            </h3>

            {description && (
                <p className="text-dark-text-secondary light:text-light-text-secondary max-w-md mb-6">
                    {description}
                </p>
            )}

            {action}
        </div>
    )
}

export default EmptyState
