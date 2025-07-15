import { registerUser, loginUser, updateProfile, getProfile, listAppointment, cancelAppointment, bookAppointment, paymentRazorpay} from "../controllers/userController";
import express from 'express'
import authUser from '../middleware/authUser.js'
import {upload} from '../middleware/multer.js'

export const userRouter = express.Router()


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.get('/appointments',authUser,listAppointment)
userRouter.post('/cancel-appointment',authUser,cancelAppointment)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
