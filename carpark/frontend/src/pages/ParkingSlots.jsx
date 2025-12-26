import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ArrowRight, X, Car, Truck, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/common/Button'
import Modal from '@components/common/Modal'
import CarLoader from '@components/loaders/CarLoader'
import { fetchSlots, selectSlot } from '@features/parking/parkingSlice'
import { mockGetSlots } from '@api/parkingApi'
import { SLOT_STATUS } from '@utils/constants'

/**
 * Parking Slots Page
 */
const ParkingSlots = () => {
    const { lotId } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { selectedLot, slots, selectedSlot, loading } = useSelector(state => state.parking)

    const [selectedZone, setSelectedZone] = useState('A')
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    const zones = ['A', 'B', 'C', 'D']

    useEffect(() => {
        // Load slots for the selected zone / floor
        // We pass the selectedZone as the "floorId" parameter — the slice will use mock fallback when backend is unavailable
        dispatch(fetchSlots({ lotId, floorId: selectedZone }))
    }, [lotId, selectedZone, dispatch])

    const handleSlotClick = slot => {
        if (slot.status === SLOT_STATUS.AVAILABLE) {
            dispatch(selectSlot(slot))
        }
    }

    const handleContinue = () => {
        if (selectedSlot) {
            setShowConfirmModal(true)
        }
    }

    const handleConfirmBooking = () => {
        // Handle booking confirmation
        setShowConfirmModal(false)
        navigate('/dashboard')
    }

    const getSlotClassName = slot => {
        const baseClasses = 'flex flex-col items-center justify-center p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden border-2'

        if (slot.status === SLOT_STATUS.AVAILABLE) {
            return `${baseClasses} ${selectedSlot?.id === slot.id
                ? 'bg-status-available/20 border-primary shadow-[0_0_15px_rgba(110,231,183,0.3)]'
                : 'bg-status-available/10 border-status-available hover:bg-status-available/20'
                }`
        } else if (slot.status === SLOT_STATUS.OCCUPIED) {
            return `${baseClasses} bg-blue-500/20 border-blue-500 cursor-not-allowed`
        } else if (slot.status === 'OUT_OF_ORDER' || slot.status === 'MAINTENANCE') {
            return `${baseClasses} bg-red-500/20 border-red-500 cursor-not-allowed`
        } else {
            return `${baseClasses} bg-dark-surface light:bg-light-surface border-dark-border text-dark-text-muted cursor-not-allowed`
        }
    }

    if (loading) {
        return <CarLoader message="Loading parking slots..." />
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-dark-text-primary light:text-light-text-primary">
                        {selectedLot?.name || 'Dubai Marina Parking'}
                    </h1>
                    <p className="text-sm text-dark-text-secondary light:text-light-text-secondary">
                        {selectedLot?.address || 'Courtyard Marina View Tower'}
                    </p>
                </div>
                <button
                    onClick={() => navigate('/parking-lots')}
                    className="p-2 hover:bg-dark-surface light:hover:bg-light-surface rounded-lg"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Zone Tabs */}
            <div className="flex gap-2">
                {zones.map(zone => (
                    <button
                        key={zone}
                        onClick={() => setSelectedZone(zone)}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${selectedZone === zone
                            ? 'bg-dark-text-primary light:bg-light-text-primary text-dark-bg'
                            : 'bg-dark-surface light:bg-light-surface text-dark-text-secondary light:text-light-text-secondary hover:text-primary'
                            }`}
                    >
                        Zone {zone}
                    </button>
                ))}
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {slots.map((slot, index) => {
                    const isTruck = slot.supportedVehicleType === 'TRUCK'
                    const Icon = isTruck ? Truck : Car

                    return (
                        <motion.div
                            key={slot.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.02 }}
                            onClick={() => handleSlotClick(slot)}
                            className={getSlotClassName(slot)}
                        >
                            <span className="absolute top-2 left-2 text-[10px] font-bold opacity-50">
                                #{slot.number || slot.slotNumber}
                            </span>

                            <div className={`transition-transform duration-500 ${slot.status === SLOT_STATUS.OCCUPIED ? 'scale-110' : 'scale-90 opacity-40'}`}>
                                <Icon size={48} className={
                                    slot.status === SLOT_STATUS.AVAILABLE ? 'text-status-available' :
                                        slot.status === SLOT_STATUS.OCCUPIED ? 'text-blue-400' : 'text-red-400'
                                } />
                            </div>

                            <div className="mt-2 text-[10px] font-medium uppercase tracking-wider">
                                {slot.status === SLOT_STATUS.AVAILABLE ? (isTruck ? 'Truck' : 'Car') : slot.status}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 p-4 rounded-xl bg-dark-surface/50 border border-dark-border">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-status-available/20 border-2 border-status-available rounded-md"></div>
                    <span className="text-sm font-medium">Available (Green)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500/20 border-2 border-blue-500 rounded-md"></div>
                    <span className="text-sm font-medium">Occupied (Blue)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500/20 border-2 border-red-500 rounded-md"></div>
                    <span className="text-sm font-medium">Out of Order (Red)</span>
                </div>
                <div className="flex items-center gap-2 ml-auto text-dark-text-muted">
                    <Info size={14} />
                    <span className="text-[10px]">Icons indicate eligible vehicle types</span>
                </div>
            </div>

            {/* Continue Button */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContinue}
                    disabled={!selectedSlot}
                    icon={ArrowRight}
                >
                    Continue
                </Button>
            </div>

            {/* Confirmation Modal */}
            <Modal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                title="Confirm booking"
            >
                <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-dark-border light:border-light-border">
                        <span className="text-dark-text-secondary light:text-light-text-secondary">Parking zone</span>
                        <span className="font-semibold text-dark-text-primary light:text-light-text-primary">
                            Zone {selectedSlot?.zone}
                        </span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-dark-border light:border-light-border">
                        <span className="text-dark-text-secondary light:text-light-text-secondary">Parking place</span>
                        <span className="font-semibold text-dark-text-primary light:text-light-text-primary">
                            {selectedSlot?.number}
                        </span>
                    </div>

                    <div className="flex justify-between py-3 border-b border-dark-border light:border-light-border">
                        <span className="text-dark-text-secondary light:text-light-text-secondary">Payment</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm">💳</span>
                            <span className="font-semibold text-dark-text-primary light:text-light-text-primary">
                                MasterCard ••2456
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-between items-end py-3">
                        <div>
                            <p className="text-3xl font-bold text-primary">$3.99</p>
                            <p className="text-sm text-dark-text-muted light:text-light-text-muted">per hour</p>
                        </div>

                        <Button variant="primary" onClick={handleConfirmBooking}>
                            Confirm
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ParkingSlots
