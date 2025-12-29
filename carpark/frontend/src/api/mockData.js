// Central mock data used when backend is unavailable
// All user-facing text contains the tag 'dummy' so it's easy to identify

export const mockDashboardSummary = async () => {
    await new Promise(r => setTimeout(r, 300))
    return {
        summary: {
            totalExpenses: 1234.56,
            activeSessions: 12,
            occupancyRate: 42,
            note: 'dummy dashboard summary data',
        },
        recentActivity: [
            { id: 1, text: 'dummy - Car ABC123 entered at Gate 2', time: '2025-12-21T09:10:00' },
            { id: 2, text: 'dummy - Booking 987 confirmed', time: '2025-12-21T08:45:00' },
        ],
    }
}

export const mockRevenueData = async period => {
    await new Promise(r => setTimeout(r, 250))
    return [
        { date: '2025-12-15', revenue: 120.5, note: 'dummy' },
        { date: '2025-12-16', revenue: 220.0, note: 'dummy' },
        { date: '2025-12-17', revenue: 180.25, note: 'dummy' },
    ]
}

export const mockUserProfile = async () => {
    await new Promise(r => setTimeout(r, 150))
    return {
        id: 1,
        name: 'dummy Admin',
        email: 'admin@digipark.com',
        role: 'ADMIN',
        bio: 'dummy profile for development',
    }
}
