import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './app/store'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ParkingLots from './pages/ParkingLots'
import ParkingSlots from './pages/ParkingSlots'
import BillingHistory from './pages/BillingHistory'
import SettingsLoader from './pages/SettingsLoader'
import NotFound from './pages/NotFound'
import OutOfService from './pages/OutOfService'
import AppShell from './components/layout/AppShell'
import Admin from './pages/Admin'
import GateControl from './pages/GateControl'
import DataStudio from './pages/DataStudio'
import AuthGuard from './auth/AuthGuard'
import './index.css'

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/out-of-service" element={<OutOfService />} />

                    {/* Protected Routes */}
                    <Route
                        path="/*"
                        element={
                            <AuthGuard>
                                <AppShell />
                            </AuthGuard>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="parking-lots" element={<ParkingLots />} />
                        <Route path="parking-slots/:lotId" element={<ParkingSlots />} />
                        <Route path="billing" element={<BillingHistory />} />
                        <Route path="history" element={<BillingHistory />} />
                        <Route path="admin" element={<Admin />} />
                        <Route path="admin/gate-control" element={<GateControl />} />
                        <Route path="admin/data-studio" element={<DataStudio />} />
                        <Route path="settings" element={<SettingsLoader />} />

                        {/* 404 - Must be last */}
                        <Route path="404" element={<NotFound />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App
