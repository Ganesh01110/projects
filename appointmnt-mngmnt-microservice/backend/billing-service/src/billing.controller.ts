import { Request, Response } from 'express';
import { 
  generateBill, 
  markBillAsPaid, 
  fetchAllBills, 
  fetchBillsByPatientId 
} from './billing.service';

export const createBill = async (req: Request, res: Response) => {
  const { patientId, amount, description } = req.body;
  try {
    const bill = await generateBill(patientId, amount, description);
    res.status(201).json(bill);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};

export const payBill = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const bill = await markBillAsPaid(parseInt(id));
    res.json(bill);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};

export const getAllBills = async (_: Request, res: Response) => {
  try {
    const bills = await fetchAllBills();
    res.json(bills);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};

export const getBillsByPatientId = async (req: Request, res: Response) => {
  const { patientId } = req.params;
  try {
    const bills = await fetchBillsByPatientId(parseInt(patientId));
    res.json(bills);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};
