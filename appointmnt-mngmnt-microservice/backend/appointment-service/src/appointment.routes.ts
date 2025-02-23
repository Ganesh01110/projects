import express from 'express';
import { 
  scheduleAppointment, 
  completeAppointment, 
  getAllAppointments, 
  getAppointmentsByUserId 
} from './appointment.controller';

const router = express.Router();

router.post('/', scheduleAppointment); // Schedule an appointment
router.put('/appointment/:id/complete', completeAppointment); // Complete an appointment
router.get('/appointments', getAllAppointments); // Get all appointments
router.get('/appointments/:userId', getAppointmentsByUserId); // Get appointments by user ID

export default router;
