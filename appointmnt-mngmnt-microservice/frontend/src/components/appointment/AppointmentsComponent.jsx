import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
    getAllAppointments, 
    getAppointmentsByUser, 
    completeAppointment, 
    scheduleAppointment } from "../../AppStore/AuthSlice/appointmentSlice";
    import DataTable from "react-data-table-component";


const AppointmentsComponent = () => {
  const dispatch = useDispatch();
  const { appointments, userAppointments, loading, error } = useSelector(state => state.appointment);
  const [userId, setUserId] = useState('');
  const [statusUpdate, setStatusUpdate] = useState({ id: '', status: '' });
  const [newAppointment, setNewAppointment] = useState({ userId: '', doctor: '', date: '' });

  console.log("userAppointments::",userAppointments);
  

  useEffect(() => {
    dispatch(getAllAppointments());
  }, [dispatch]);

  const handleFetchByUserId = () => {
    if (userId) dispatch(getAppointmentsByUser(userId));
  };

  const columns1 = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "user", selector: (row) => row.userId, sortable: true },
    { name: "status", selector: (row) => row.status, sortable: true },
    { name: "date", selector: (row) => row.date },
  ]

  const columns2 = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "user", selector: (row) => row.userId, sortable: true },
    { name: "status", selector: (row) => row.status, sortable: true },
    { name: "date", selector: (row) => row.date },
    // { name: "Email", selector: (row) => row.email },
  ]

  const handleUpdateStatus = () => {
    if (statusUpdate.id && statusUpdate.status) dispatch(completeAppointment(statusUpdate));
  };

  const handleCreateAppointment = () => {
    if (newAppointment.userId && newAppointment.doctor && newAppointment.date) {
      dispatch(scheduleAppointment(newAppointment));
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-xl font-bold">Appointments</h1>

      {/* Fetch All Appointments */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">All Appointments</h2>
        {loading ? <p>Loading...</p> : error ? <p>{error}</p> : (
        //   <ul>
        //     {appointments.map(app => (
        //       <li key={app.id}>ID: {app.id}, User: {app.userId}, Status: {app.status}</li>
        //     ))}
        //   </ul>
        <DataTable 
        columns={columns1} 
        data={appointments} 
        pagination />

        )}
      </div>

      {/* Fetch Appointment by User ID */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Get Appointment by User ID</h2>
        <input type="text" value={userId} onChange={e => setUserId(e.target.value)} placeholder="Enter User ID" className="border p-2" />
        <button onClick={handleFetchByUserId} className="bg-blue-500 text-white p-2 ml-2">Fetch</button>
        {userAppointments && (
            // <div>hill</div>
        //   <ul>
        //     {userAppointments?.appointments.map(app => (
        //       <li key={app.id}>ID: {app.id}, Status: {app.status}</li>
        //     ))}
        //   </ul>
<DataTable 
columns={columns2} 
data={userAppointments?.appointments} 
pagination />

        )}
      </div>

      {/* Update Appointment Status */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Update Appointment Status</h2>
        <input type="text" placeholder="Appointment ID" onChange={e => setStatusUpdate({ ...statusUpdate, id: e.target.value })} className="border p-2" />
        <input type="text" placeholder="New Status" onChange={e => setStatusUpdate({ ...statusUpdate, status: e.target.value })} className="border p-2 ml-2" />
        <button onClick={handleUpdateStatus} className="bg-green-500 text-white p-2 ml-2">Update</button>
      </div>

      {/* Create Appointment (Added in User Component as well) */}
      <div className="border p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold">Create Appointment</h2>
        <input type="text" placeholder="User ID" onChange={e => setNewAppointment({ ...newAppointment, userId: e.target.value })} className="border p-2" />
        <input type="text" placeholder="Doctor" onChange={e => setNewAppointment({ ...newAppointment, doctor: e.target.value })} className="border p-2 ml-2" />
        <input type="date" onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} className="border p-2 ml-2" />
        <button onClick={handleCreateAppointment} className="bg-purple-500 text-white p-2 ml-2">Create</button>
      </div>
    </div>
  );
};

export default AppointmentsComponent;
