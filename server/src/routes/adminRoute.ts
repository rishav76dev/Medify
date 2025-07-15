import express, { Request, Response } from "express";
import { addDoctor, allDoctor, appointmentCancel, appointmentsAdmin, loginAdmin } from "../controllers/adminController";
import { upload } from "../middleware/multer";
import { authAdmin } from "../middleware/authAdmin";
import { changeAvailability } from "../controllers/doctorController";
export const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin,upload.single('image'), addDoctor)

adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctor', authAdmin,allDoctor)

adminRouter.post('/change-availability', authAdmin,changeAvailability)
adminRouter.get('/all-appointments', authAdmin, appointmentsAdmin)
adminRouter.post('/cancel-appointment',authAdmin,appointmentCancel)
