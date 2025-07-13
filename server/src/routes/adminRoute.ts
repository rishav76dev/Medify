import express, { Request, Response } from "express";
import { addDoctor, allDoctor, loginAdmin } from "../controllers/adminController";
import { upload } from "../middleware/multer";
import { authAdmin } from "../middleware/authAdmin";
import { changeAvailability } from "../controllers/doctorController";
export const adminRouter = express.Router()
//todo add authAdmin middleware
adminRouter.post('/add-doctor',authAdmin,upload.single('image'), addDoctor)

adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctor', authAdmin,allDoctor)

adminRouter.post('/change-availability', authAdmin,changeAvailability)