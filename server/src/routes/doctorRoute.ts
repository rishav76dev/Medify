
import express, { Request, Response } from 'express';
import { appointmentCancel, appointmentComplete, appointmentsDoctor, doctorDashboard, doctorList, doctorProfile, loginDoctor, updateDoctorProfile } from '../controllers/doctorController';
import authDoctor from '../middleware/authDoctor';

export const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor)
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete)
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel)

doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)

doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor, updateDoctorProfile)
