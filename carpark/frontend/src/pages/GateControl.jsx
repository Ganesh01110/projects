import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { Car, LogOut, FileText } from 'lucide-react'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Card from '@components/common/Card'
import CarLoader from '@components/loaders/CarLoader'
import { enterVehicle, exitVehicle, clearGateState } from '@features/gate/gateSlice'

const GateControl = () => {
    const dispatch = useDispatch()
    const { loading, lastEntryResult, lastExitResult, error } = useSelector(state => state.gate)

    const [activeTab, setActiveTab] = useState('entry') // 'entry' | 'exit'

    // Entry Form
    const [entryForm, setEntryForm] = useState({
        vehicleNumber: '',
        type: 'CAR'
    })

    // Exit Form
    const [exitForm, setExitForm] = useState({
        vehicleNumber: ''
    })

    // Clear messages on tab switch
    useEffect(() => {
        dispatch(clearGateState())
    }, [activeTab, dispatch])

    const handleEntrySubmit = (e) => {
        e.preventDefault()
        if (!entryForm.vehicleNumber) return
        dispatch(enterVehicle(entryForm))
    }

    const handleExitSubmit = (e) => {
        e.preventDefault()
        if (!exitForm.vehicleNumber) return
        dispatch(exitVehicle(exitForm.vehicleNumber))
    }

    const vehicleTypes = ['CAR', 'BIKE', 'TRUCK', 'EV']

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-dark-text-primary light:text-light-text-primary">
                    Gate Control
                </h1>
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'entry' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('entry')}
                        icon={Car}
                    >
                        Entry Gate
                    </Button>
                    <Button
                        variant={activeTab === 'exit' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('exit')}
                        icon={LogOut}
                    >
                        Exit Gate
                    </Button>
                </div>
            </div>

            {loading && <CarLoader message="Processing gate request..." />}

            {/* Error Message */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-500/10 border border-red-500 text-red-500"
                >
                    <p className="font-semibold">Error Processing Request</p>
                    <p className="text-sm">{typeof error === 'string' ? error : error.message || 'Unknown error'}</p>
                </motion.div>
            )}

            {/* Success Messages */}
            {lastEntryResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-green-500/10 border border-green-500 text-green-500"
                >
                    <p className="font-bold flex items-center gap-2">
                        <FileText size={18} />
                        Entry Successful
                    </p>
                    <p>{lastEntryResult}</p>
                </motion.div>
            )}

            {lastExitResult && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-lg bg-primary/10 border border-primary text-primary"
                >
                    <p className="font-bold text-xl flex items-center gap-2 mb-2">
                        <FileText size={24} />
                        Exit Processed & Billed
                    </p>
                    <p className="text-lg text-white">{lastExitResult}</p>
                </motion.div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
                {/* Main Form Area */}
                <div className="md:col-span-1">
                    {activeTab === 'entry' ? (
                        <Card title="Vehicle Entry">
                            <form onSubmit={handleEntrySubmit} className="space-y-4">
                                <Input
                                    label="Vehicle Number"
                                    placeholder="e.g. MH12AB1234"
                                    value={entryForm.vehicleNumber}
                                    onChange={(e) => setEntryForm({ ...entryForm, vehicleNumber: e.target.value })}
                                    required
                                    autoFocus
                                />

                                <div>
                                    <label className="block text-sm font-medium text-dark-text-secondary mb-1">
                                        Vehicle Type
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {vehicleTypes.map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setEntryForm({ ...entryForm, type })}
                                                className={`p-2 rounded border text-sm font-medium transition-colors ${entryForm.type === type
                                                        ? 'bg-primary border-primary text-black'
                                                        : 'bg-transparent border-dark-border text-dark-text-secondary hover:border-primary'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Button type="submit" variant="primary" fullWidth size="lg">
                                    Simulate Entry
                                </Button>
                            </form>
                        </Card>
                    ) : (
                        <Card title="Vehicle Exit">
                            <form onSubmit={handleExitSubmit} className="space-y-4">
                                <Input
                                    label="Vehicle Number"
                                    placeholder="e.g. MH12AB1234"
                                    value={exitForm.vehicleNumber}
                                    onChange={(e) => setExitForm({ ...exitForm, vehicleNumber: e.target.value })}
                                    required
                                    autoFocus
                                />
                                <div className="bg-dark-surface p-4 rounded text-sm text-dark-text-muted">
                                    <p>⚠️ Only process exit if physical payment is collected or billing is automated.</p>
                                </div>

                                <Button type="submit" variant="danger" fullWidth size="lg">
                                    Process Exit & Calculate Bill
                                </Button>
                            </form>
                        </Card>
                    )}
                </div>

                {/* Info / Instructions Panel */}
                <div className="md:col-span-1">
                    <Card title="Operator Instructions">
                        <ul className="list-disc pl-5 space-y-2 text-dark-text-secondary text-sm">
                            <li>
                                <span className="text-white font-medium">Entry:</span> Ensure the vehicle number is entered correctly without spaces.
                            </li>
                            <li>
                                Select the correct vehicle type to ensure accurate slot allocation (e.g., EV spots for EVs).
                            </li>
                            <li>
                                <span className="text-white font-medium">Exit:</span> Upon exit, the system will calculate the parking duration and generate the final bill amount.
                            </li>
                            <li>
                                If a vehicle is not found during exit, verify if it was correctly entered into the system.
                            </li>
                        </ul>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default GateControl
