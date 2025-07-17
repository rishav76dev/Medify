
import express, { Request, Response } from 'express';
import { doctorList, loginDoctor } from '../controllers/doctorController';

export const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)



doctorRouter.post('/login',loginDoctor)
