import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Button from '@components/common/Button'
import Input from '@components/common/Input'
import Card from '@components/common/Card'
import CarLoader from '@components/loaders/CarLoader'
import {
    fetchUsers,
    createUser,
    updateUser,
    removeUser,
    fetchRoles,
    fetchZones,
    createZone,
    fetchLots,
    createLot,
    updateLot,
    removeLot,
    fetchFloors,
    createFloor,
    fetchSlots,
    createSlot,
} from '@features/admin/adminSlice'

const Admin = () => {
    const dispatch = useDispatch()
    const { users, roles, lots, zones, floors, slots, loading } = useSelector(state => state.admin)

    const [tab, setTab] = useState('users')
    const [form, setForm] = useState({ username: '', email: '', name: '', role: 'USER' })
    const [editing, setEditing] = useState(null)

    const [lotForm, setLotForm] = useState({ name: '', address: '', price: '', zoneId: '' })
    const [editingLot, setEditingLot] = useState(null)

    useEffect(() => {
        dispatch(fetchUsers())
        dispatch(fetchRoles())
        dispatch(fetchZones())
        dispatch(fetchLots())
    }, [dispatch])

    const handleCreateUser = () => {
        if (editing) {
            dispatch(updateUser({ id: editing.id, payload: form }))
            setEditing(null)
        } else {
            dispatch(createUser(form))
        }
        setForm({ username: '', email: '', name: '', role: 'USER' })
    }

    const handleEditUser = u => {
        setEditing(u)
        setForm({ username: u.username, email: u.email, name: u.name, role: u.role })
    }

    const handleDeleteUser = id => dispatch(removeUser(id))

    const handleCreateLot = () => {
        const payload = { ...lotForm, zone: { id: lotForm.zoneId } }
        if (editingLot) {
            dispatch(updateLot({ id: editingLot.id, payload: payload }))
            setEditingLot(null)
        } else {
            dispatch(createLot(payload))
        }
        setLotForm({ name: '', address: '', price: '', zoneId: '' })
    }

    const handleEditLot = l => {
        setEditingLot(l)
        setLotForm({ name: l.name, address: l.address, price: l.price, zoneId: l.zone?.id || '' })
    }

    const handleDeleteLot = id => dispatch(removeLot(id))

    if (loading) return <CarLoader message="Loading admin data..." />

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin</h1>
                <div className="flex gap-2">
                    <Button variant={tab === 'users' ? 'primary' : 'outline'} onClick={() => setTab('users')}>Users</Button>
                    <Button variant={tab === 'parking' ? 'primary' : 'outline'} onClick={() => setTab('parking')}>Parking</Button>
                    <Button variant={tab === 'infra' ? 'primary' : 'outline'} onClick={() => setTab('infra')}>Infrastructure</Button>
                </div>
            </div>

            {tab === 'infra' && <InfrastructureTab zones={zones} lots={lots} floors={floors} slots={slots} dispatch={dispatch} />}

            {tab === 'users' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <h3 className="font-semibold mb-4">{editing ? 'Edit user' : 'Create user'}</h3>
                            <Input label="Username" value={form.username} onChange={e => setForm(prev => ({ ...prev, username: e.target.value }))} />
                            <Input label="Email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
                            <Input label="Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
                            <label className="block text-sm mt-2">Role</label>
                            <select className="w-full p-2 rounded border mt-1" value={form.role} onChange={e => setForm(prev => ({ ...prev, role: e.target.value }))}>
                                {(Array.isArray(roles) ? roles : []).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="mt-4 flex gap-2">
                                <Button onClick={handleCreateUser} variant="primary">{editing ? 'Save' : 'Create'}</Button>
                                {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({ username: '', email: '', name: '', role: 'USER' }) }}>Cancel</Button>}
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        {(Array.isArray(users) ? users : []).map(u => (
                            <Card key={u.id} hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{u.name} <span className="text-xs text-dark-text-secondary">({u.username})</span></div>
                                        <div className="text-sm text-dark-text-secondary">{u.email}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEditUser(u)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteUser(u.id)}>Delete</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {tab === 'parking' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div>
                        <Card>
                            <h3 className="font-semibold mb-4">{editingLot ? 'Edit lot' : 'Create lot'}</h3>
                            <Input label="Name" value={lotForm.name} onChange={e => setLotForm(prev => ({ ...prev, name: e.target.value }))} />
                            <Input label="Address" value={lotForm.address} onChange={e => setLotForm(prev => ({ ...prev, address: e.target.value }))} />
                            <Input label="Price" value={lotForm.price} onChange={e => setLotForm(prev => ({ ...prev, price: e.target.value }))} />
                            <label className="block text-sm mt-2">Zone</label>
                            <select
                                className="w-full p-2 rounded border mt-1 bg-dark-surface"
                                value={lotForm.zoneId}
                                onChange={e => setLotForm(prev => ({ ...prev, zoneId: e.target.value }))}
                            >
                                <option value="">Select Zone...</option>
                                {(Array.isArray(zones) ? zones : []).map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                            </select>
                            <div className="mt-4 flex gap-2">
                                <Button variant="primary" onClick={handleCreateLot}>{editingLot ? 'Save' : 'Create'}</Button>
                                {editingLot && <Button variant="outline" onClick={() => { setEditingLot(null); setLotForm({ name: '', address: '', price: '' }) }}>Cancel</Button>}
                            </div>
                        </Card>
                    </div>

                    <div className="md:col-span-2 space-y-4">
                        {(Array.isArray(lots) ? lots : []).map(l => (
                            <Card key={l.id} hover>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold">{l.name}</div>
                                        <div className="text-sm text-dark-text-secondary">{l.address} <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px]">{l.zone?.name || 'No Zone'}</span></div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEditLot(l)}>Edit</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleDeleteLot(l.id)}>Delete</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

const InfrastructureTab = ({ zones, lots, floors, slots, dispatch }) => {
    const [selectedZoneId, setSelectedZoneId] = useState('')
    const [selectedLotId, setSelectedLotId] = useState('')
    const [selectedFloorId, setSelectedFloorId] = useState('')

    const [newFloorNum, setNewFloorNum] = useState('')
    const [newSlotNum, setNewSlotNum] = useState('')
    const [newSlotType, setNewSlotType] = useState('CAR')

    const handleZoneChange = (e) => {
        const id = e.target.value
        setSelectedZoneId(id)
        setSelectedLotId('')
        setSelectedFloorId('')
        if (id) dispatch(fetchLots(id))
    }

    const handleLotChange = (e) => {
        const id = e.target.value
        setSelectedLotId(id)
        setSelectedFloorId('')
        if (id) dispatch(fetchFloors(id))
    }

    const handleFloorChange = (e) => {
        const id = e.target.value
        setSelectedFloorId(id)
        if (id) dispatch(fetchSlots(id))
    }

    const handleAddFloor = () => {
        if (selectedLotId && newFloorNum) {
            dispatch(createFloor({ lotId: selectedLotId, payload: { floorNumber: parseInt(newFloorNum) } }))
            setNewFloorNum('')
        }
    }

    const handleAddSlot = () => {
        if (selectedFloorId && newSlotNum) {
            dispatch(createSlot({ floorId: selectedFloorId, payload: { slotNumber: parseInt(newSlotNum), supportedVehicleType: newSlotType } }))
            setNewSlotNum('')
        }
    }

    return (
        <div className="space-y-6">
            <Card title="Manage Floors & Slots">
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Select Zone</label>
                        <select
                            className="w-full p-2 rounded border bg-dark-surface"
                            value={selectedZoneId}
                            onChange={handleZoneChange}
                        >
                            <option value="">Select Zone...</option>
                            {(Array.isArray(zones) ? zones : []).map(z => <option key={z.id} value={z.id}>{z.name}</option>)}
                        </select>

                        <div className="mt-4">
                            <label className="block text-sm font-medium mb-1">Select Building</label>
                            <select
                                className="w-full p-2 rounded border bg-dark-surface"
                                value={selectedLotId}
                                onChange={handleLotChange}
                            >
                                <option value="">Select Building...</option>
                                {(Array.isArray(lots) ? lots : []).map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Add Floor</h4>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Floor Number"
                                    type="number"
                                    value={newFloorNum}
                                    onChange={e => setNewFloorNum(e.target.value)}
                                />
                                <Button onClick={handleAddFloor}>Add</Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Select Floor</label>
                        <select
                            className="w-full p-2 rounded border bg-dark-surface"
                            value={selectedFloorId}
                            onChange={handleFloorChange}
                        >
                            <option value="">Select...</option>
                            {(Array.isArray(floors) ? floors : []).map(f => <option key={f.id} value={f.id}>Floor {f.floorNumber}</option>)}
                        </select>

                        <div className="mt-6">
                            <h4 className="font-semibold mb-2">Add Slot</h4>
                            <div className="space-y-2">
                                <Input
                                    placeholder="Slot Number"
                                    type="number"
                                    value={newSlotNum}
                                    onChange={e => setNewSlotNum(e.target.value)}
                                />
                                <div className="flex gap-2">
                                    <select
                                        className="p-2 rounded border bg-dark-surface flex-1"
                                        value={newSlotType}
                                        onChange={e => setNewSlotType(e.target.value)}
                                    >
                                        <option value="CAR">CAR</option>
                                        <option value="BIKE">BIKE</option>
                                        <option value="TRUCK">TRUCK</option>
                                        <option value="EV">EV</option>
                                    </select>
                                    <Button onClick={handleAddSlot}>Add Slot</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            <Card title="Current Slots">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {(Array.isArray(slots) ? slots : []).map(s => (
                        <div key={s.id} className="p-2 border rounded bg-dark-surface/50 text-center">
                            <div className="font-bold text-primary">#{s.slotNumber}</div>
                            <div className="text-[10px] text-dark-text-secondary">{s.supportedVehicleType}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}

export default Admin
