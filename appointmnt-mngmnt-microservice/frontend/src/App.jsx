import { useState } from 'react'
import './App.css'
import Login from "./pages/login";
import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/Dashboards/AdminDashboard";
import NotFound from "./pages/NotFound";
// import ReceptionistDashboard from "./pages/Dashboards/ReceptionistDashboard";
import Register from './pages/Register';
// import Home from './pages/Home';


function App() {

  return (
    <>
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
     
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} >
          {/* <Route index element={<Home />}/> */}

          </Route>
          {/* <Route path="/receptionist-dashboard" element={<ReceptionistDashboard />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      

      </main>
    </>
  )
}

export default App
