import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CarLoader from '@components/loaders/CarLoader'

/**
 * SettingsLoader - shows a loader then redirects to 404 (NotFound)
 */
const SettingsLoader = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const t = setTimeout(() => {
            navigate('/404')
        }, 3000)

        return () => clearTimeout(t)
    }, [navigate])

    return <CarLoader message="Opening settings..." />
}

export default SettingsLoader
