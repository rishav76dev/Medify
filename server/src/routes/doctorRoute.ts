
import express, { Request, Response } from 'express';
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorList, loginDoctor } from '../controllers/doctorController';
import authDoctor from '../middleware/authDoctor';

export const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)

doctorRouter.post('/login',loginDoctor)
