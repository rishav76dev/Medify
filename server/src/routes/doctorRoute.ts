
import express, { Request, Response } from 'express';
import { doctorList } from '../controllers/doctorController';

export const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
