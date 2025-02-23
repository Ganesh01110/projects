import express from 'express';
import { 
  createBill, 
  payBill, 
  getAllBills, 
  getBillsByPatientId 
} from './billing.controller';

const router = express.Router();

router.post('/bill', createBill); // Create a bill
router.put('/bill/:id/pay', payBill); // Mark a bill as paid
router.get('/bills', getAllBills); // Get all bills
router.get('/bills/:patientId', getBillsByPatientId); // Get bills by patient ID

export default router;
