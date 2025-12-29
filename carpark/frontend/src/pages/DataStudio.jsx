import { useEffect, useState } from 'react'
import Button from '@components/common/Button'
import Card from '@components/common/Card'
import Input from '@components/common/Input'
import CarLoader from '@components/loaders/CarLoader'
import * as adminApi from '@api/adminApi'

const DataStudio = () => {
    const [loading, setLoading] = useState(true)
    const [tab, setTab] = useState('parking')

    // Parking/Lots
    const [lots, setLots] = useState([])
    const [lotForm, setLotForm] = useState({ name: '', address: '', price: '' })
    const [editingLot, setEditingLot] = useState(null)

    // Floors & Slots
    const [selectedLot, setSelectedLot] = useState(null)
    const [floors, setFloors] = useState([])
    const [floorName, setFloorName] = useState('')
    const [slots, setSlots] = useState([])
    const [slotForm, setSlotForm] = useState({ number: '', zone: 'A', status: 'AVAILABLE' })
    const [selectedFloor, setSelectedFloor] = useState(null)

    // Billing
    const [billing, setBilling] = useState([])
    const [billingForm, setBillingForm] = useState({ date: '', location: '', slot: '', duration: 0, amount: 0, status: 'PAID' })

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            const lotsRes = await adminApi.getLots()
            setLots(lotsRes.data || [])
            const billingRes = await adminApi.getBilling()
            setBilling(billingRes.data || [])
            setLoading(false)
        }
        load()
    }, [])

    // Lot handlers
    const saveLot = async () => {
        if (editingLot) {
            await adminApi.updateLot(editingLot.id, lotForm)
            setEditingLot(null)
        } else {
            await adminApi.createLot(lotForm)
        }
        const res = await adminApi.getLots()
        setLots(res.data)
        setLotForm({ name: '', address: '', price: '' })
    }

    const removeLot = async id => {
        await adminApi.deleteLot(id)
        const res = await adminApi.getLots()
        setLots(res.data)
    }

    // Floors & Slots
    const openLot = async lot => {
        setSelectedLot(lot)
        const res = await adminApi.getFloors(lot.id)
        setFloors(res.data || [])
        setSelectedFloor(null)
        setSlots([])
    }

    const addFloor = async () => {
        if (!selectedLot) return
        await adminApi.createFloor(selectedLot.id, { name: floorName })
        const res = await adminApi.getFloors(selectedLot.id)
        setFloors(res.data)
        setFloorName('')
    }

    const openFloor = async floor => {
        setSelectedFloor(floor)
        const res = await adminApi.getSlots(selectedLot.id, floor.id)
        setSlots(res.data || [])
    }

    const addSlot = async () => {
        if (!selectedLot || !selectedFloor) return
        await adminApi.createSlot(selectedLot.id, selectedFloor.id, slotForm)
        const res = await adminApi.getSlots(selectedLot.id, selectedFloor.id)
        setSlots(res.data)
        setSlotForm({ number: '', zone: 'A', status: 'AVAILABLE' })
    }

    // Billing
    const addBilling = async () => {
        await adminApi.createBilling(billingForm)
        const res = await adminApi.getBilling()
        setBilling(res.data)
        setBillingForm({ date: '', location: '', slot: '', duration: 0, amount: 0, status: 'PAID' })
    }

    const deleteBilling = async id => {
        await adminApi.deleteBilling(id)
        const res = await adminApi.getBilling()
        setBilling(res.data)
    }

    if (loading) return <CarLoader message="Loading data studio..." />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Data Studio (dev)</h1>
                <div className="flex gap-2">
                    <Button variant={tab === 'parking' ? 'primary' : 'outline'} onClick={() => setTab('parking')}>Parking</Button>
                    <Button variant={tab === 'billing' ? 'primary' : 'outline'} onClick={() => setTab('billing')}>Billing</Button>
                </div>
            </div>

            {tab === 'parking' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <Card>
                            <h3 className="font-semibold mb-4">{editingLot ? 'Edit lot' : 'Create lot'}</h3>
                            <Input label="Name" value={lotForm.name} onChange={e => setLotForm(prev => ({ ...prev, name: e.target.value }))} />
                            <Input label="Address" value={lotForm.address} onChange={e => setLotForm(prev => ({ ...prev, address: e.target.value }))} />
                            <Input label="Price" value={lotForm.price} onChange={e => setLotForm(prev => ({ ...prev, price: e.target.value }))} />
                            <div className="mt-4 flex gap-2">
                                <Button variant="primary" onClick={saveLot}>{editingLot ? 'Save' : 'Create'}</Button>
                            </div>
                        </Card>

                        {selectedLot && (
                            <Card className="mt-4">
                                <h4 className="font-semibold mb-2">Manage Floors for {selectedLot.name}</h4>
                                <Input label="Floor name" value={floorName} onChange={e => setFloorName(e.target.value)} />
                                <div className="mt-2">
                                    <Button onClick={addFloor} variant="primary">Add Floor</Button>
                                </div>

                                <div className="mt-4">
                                    {floors.map(f => (
                                        <Card key={f.id} className="mb-2">
                                            <div className="flex items-center justify-between">
                                                <div>{f.name}</div>
                                                <div>
                                                    <Button size="sm" variant="outline" onClick={() => openFloor(f)}>Open</Button>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        <Card>
                            <h3 className="font-semibold mb-4">Parking Lots</h3>
                            <div className="space-y-2">
                                {lots.map(l => (
                                    <Card key={l.id} hover>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{l.name}</div>
                                                <div className="text-sm text-dark-text-secondary">{l.address}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="outline" onClick={() => { setEditingLot(l); setLotForm({ name: l.name, address: l.address, price: l.price }) }}>Edit</Button>
                                                <Button size="sm" variant="outline" onClick={() => openLot(l)}>Floors</Button>
                                                <Button size="sm" variant="danger" onClick={() => removeLot(l.id)}>Archive</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>

                        {selectedFloor && (
                            <Card>
                                <h4 className="font-semibold mb-2">Slots for {selectedFloor.name}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                                    <Input label="Slot number" value={slotForm.number} onChange={e => setSlotForm(prev => ({ ...prev, number: e.target.value }))} />
                                    <Input label="Zone" value={slotForm.zone} onChange={e => setSlotForm(prev => ({ ...prev, zone: e.target.value }))} />
                                    <select className="p-2 rounded border" value={slotForm.status} onChange={e => setSlotForm(prev => ({ ...prev, status: e.target.value }))}>
                                        <option>AVAILABLE</option>
                                        <option>OCCUPIED</option>
                                        <option>RESERVED</option>
                                        <option>OUT_OF_SERVICE</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <Button variant="primary" onClick={addSlot}>Add Slot</Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                    {slots.map(s => (
                                        <Card key={s.id}>
                                            <div className="font-semibold">Slot {s.number}</div>
                                            <div className="text-sm">Zone: {s.zone}</div>
                                            <div className="mt-2">Status: {s.status}</div>
                                        </Card>
                                    ))}
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {tab === 'billing' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <Card>
                            <h3 className="font-semibold mb-4">Create Billing Record</h3>
                            <Input label="Date" value={billingForm.date} onChange={e => setBillingForm(prev => ({ ...prev, date: e.target.value }))} />
                            <Input label="Location" value={billingForm.location} onChange={e => setBillingForm(prev => ({ ...prev, location: e.target.value }))} />
                            <Input label="Slot" value={billingForm.slot} onChange={e => setBillingForm(prev => ({ ...prev, slot: e.target.value }))} />
                            <Input label="Duration (min)" value={billingForm.duration} onChange={e => setBillingForm(prev => ({ ...prev, duration: Number(e.target.value) }))} />
                            <Input label="Amount" value={billingForm.amount} onChange={e => setBillingForm(prev => ({ ...prev, amount: Number(e.target.value) }))} />
                            <div className="mt-4">
                                <Button variant="primary" onClick={addBilling}>Add</Button>
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2">
                        <Card>
                            <h3 className="font-semibold mb-4">Billing Records</h3>
                            <div className="space-y-2">
                                {billing.map(b => (
                                    <Card key={b.id} hover>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{b.location} — {new Date(b.date).toLocaleString()}</div>
                                                <div className="text-sm">Slot: {b.slot} • Amount: {b.amount}</div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" variant="danger" onClick={() => deleteBilling(b.id)}>Delete</Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DataStudio
