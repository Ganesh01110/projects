import { Request, Response } from 'express';
import {
  createAppointment,
  updateAppointmentStatus,
  fetchAllAppointments,
  fetchAppointmentsByUserId
} from './appointment.service';

export const scheduleAppointment = async (req: Request, res: Response) => {
  const { userId, doctor, date } = req.body;
  try {
    const appointment = await createAppointment(userId, doctor, date);
    res.status(201).json(appointment);
  } catch (error ) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }  
  }
};

export const completeAppointment = async (req: Request, res: Response) => {

  console.log("coplete appointment api called");
  
  const { id } = req.params;
  try {
    const appointment = await updateAppointmentStatus((id), 'completed');
    res.json(appointment);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};

export const getAllAppointments = async (_: Request, res: Response) => {
  try {
    const appointments = await fetchAllAppointments();
    res.json(appointments);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};

export const getAppointmentsByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    const appointments = await fetchAppointmentsByUserId(parseInt(userId));
    res.json(appointments);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: "An unknown error occurred" });
    }   }
};
