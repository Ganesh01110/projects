import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Navigation } from 'lucide-react'
import { motion } from 'framer-motion'
import Card from '@components/common/Card'
import Badge from '@components/common/Badge'
import Button from '@components/common/Button'
import CarLoader from '@components/loaders/CarLoader'
import { fetchParkingLots, selectLot, fetchZones } from '@features/parking/parkingSlice'
import { mockGetParkingLots } from '@api/parkingApi'

/**
 * Parking Lots Page
 */
const ParkingLots = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { lots = [], zones = [], loading } = useSelector(state => state.parking)
    const [selectedZone, setSelectedZone] = useState('All zones')

    const zoneTabs = ['All zones', ...(Array.isArray(zones) ? zones.map(z => z.name) : [])]

    useEffect(() => {
        dispatch(fetchParkingLots())
        dispatch(fetchZones())
    }, [dispatch])

    const filteredLots = (Array.isArray(lots) ? lots : []).filter(lot => {
        if (selectedZone === 'All zones') return true
        return lot.zone?.name === selectedZone
    })

    const handleSelectLot = lot => {
        dispatch(selectLot(lot))
        navigate(`/parking-slots/${lot.id}`)
    }

    if (loading) {
        return <CarLoader message="Loading parking lots..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-dark-text-primary light:text-light-text-primary mb-2">
                    Parking Nearby
                </h1>
                <p className="text-dark-text-secondary light:text-light-text-secondary flex items-center gap-2">
                    <Navigation size={16} />
                    View on map
                </p>
            </div>

            {/* Zone Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {zoneTabs.map(zone => (
                    <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedZone === zone
                            ? 'bg-primary text-dark-bg transition-transform duration-300 transform scale-105'
                            : 'bg-dark-surface light:bg-light-surface text-dark-text-secondary light:text-light-text-secondary hover:text-primary hover:bg-primary/10'
                            }`}
                    >
                        {zone}
                    </button>
                ))}
            </div>

            {/* Parking Lots Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLots.map((lot, index) => (
                    <motion.div
                        key={lot.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card hover onClick={() => handleSelectLot(lot)}>
                            {/* Image */}
                            <div className="relative h-40 -m-6 mb-4 overflow-hidden rounded-t-xl">
                                <img
                                    src={lot.image}
                                    alt={lot.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <Badge status="AVAILABLE">
                                        {lot.availableSlots} free places
                                    </Badge>
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-dark-text-primary light:text-light-text-primary mb-2">
                                {lot.name}
                            </h3>

                            <p className="text-sm text-dark-text-secondary light:text-light-text-secondary flex items-center gap-2 mb-3">
                                <MapPin size={14} />
                                {lot.address}
                            </p>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-primary">
                                        ${lot.price}
                                    </p>
                                    <p className="text-xs text-dark-text-muted light:text-light-text-muted">
                                        per hour
                                    </p>
                                </div>

                                <Button variant="outline" size="sm">
                                    View Slots
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Recent Parking */}
            <div className="mt-8">
                <h2 className="text-xl font-semibold text-dark-text-primary light:text-light-text-primary mb-4">
                    Recent parking
                </h2>
                <div className="text-dark-text-muted light:text-light-text-muted text-sm">
                    No recent parking history
                </div>
            </div>
        </div>
    )
}

export default ParkingLots
