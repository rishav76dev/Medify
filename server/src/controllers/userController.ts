import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { userModel } from "../models/userModel";
import { appointmentModel } from "../models/appointmentModel";
import { DoctorModel } from "../models/doctorModel";
export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.json({ success: false, message: "Missing details" });
      return;
    }

    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "Enter a valid email" });
      return;
    }

    if (password.length < 8) {
      res.json({
        success: false,
        message: "Password should be at least 8 characters",
      });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret"
    );

    res.json({ success: true, token });
  } catch (error: unknown) {
    console.error("Error registering user:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      res.json({ success: false, message: "User does not exist" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret"
    );
    res.json({ success: true, token });
  } catch (error: unknown) {
    console.error("Error logging in user:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error: unknown) {
    console.error("Error getting user profile:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      res.json({ success: false, message: "Missing data" });
      return;
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: address ? JSON.parse(address) : undefined,
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile updated" });
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};




export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await DoctorModel.findById(docId).select("-password");
        if (!docData) {
            res.json({ success: false, message: "Doctor not found" });
            return;
        }

        if (!docData.available) {
            res.json({ success: false, message: "Doctor not available" });
            return;
        }

        const slotsBooked = docData.slots_booked;

        if (slotsBooked[slotDate]) {
            if (slotsBooked[slotDate].includes(slotTime)) {
                res.json({ success: false, message: "Slot not available" });
                return;
            } else {
                slotsBooked[slotDate].push(slotTime);
            }
        } else {
            slotsBooked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) {
            res.json({ success: false, message: "User not found" });
            return;
        }

        const { slots_booked, ...doctorDataForAppointment } = docData.toObject();

        const appointmentData = {
            userId,
            docId,
            userData,
            docData: doctorDataForAppointment,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();
        await DoctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });

        res.json({ success: true, message: "Appointment booked" });
    } catch (error: unknown) {
        console.error("Error booking appointment:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const listAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.body;

        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error: unknown) {
        console.error("Error listing appointments:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};

export const cancelAppointment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, appointmentId } = req.body;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData) {
            res.json({ success: false, message: "Appointment not found" });
            return;
        }

        if (appointmentData.userId.toString() !== userId) {
            res.json({ success: false, message: "Unauthorized action" });
            return;
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await DoctorModel.findById(docId);

        if (!doctorData) {
            res.json({ success: false, message: "Doctor not found" });
            return;
        }

        const slotsBooked = doctorData.slots_booked;
        if (slotsBooked[slotDate]) {
            slotsBooked[slotDate] = slotsBooked[slotDate].filter((time:any) => time !== slotTime);
            if (slotsBooked[slotDate].length === 0) {
                delete slotsBooked[slotDate];
            }
        }

        await DoctorModel.findByIdAndUpdate(docId, { slots_booked: slotsBooked });
        res.json({ success: true, message: "Appointment cancelled" });
    } catch (error: unknown) {
        console.error("Error cancelling appointment:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
