import { registerUser, loginUser, updateProfile, getProfile} from "../controllers/userController";
import express from 'express'


const userRouter = express.Router()


userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
