import { Request, Response } from "express";
import { DoctorModel } from "../models/doctorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const changeAvailability = async (
  req: Request,
  res: Response
): Promise<void> => {

  try {
    const { docId } = req.body;

    if (!docId) {
      res
        .status(400)
        .json({ success: false, message: "Doctor ID is required" });
      return;
    }

    const docData = await DoctorModel.findById(docId);

    if (!docData) {
      res.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    await DoctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });

    res.status(200).json({
      success: true,
      message: "Availability changed",
    });
  } catch (error) {
    console.error("Error changing doctor availability:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while changing availability",
    });
  }
};

export const doctorList = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const doctors = await DoctorModel.find({}).select(["-password", "-email"]);
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error changing doctor availability:", error);
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "An unknown error occurred while changing availability",
    });
  }
};


export const loginDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const doctor = await DoctorModel.findOne({ email });
        if (!doctor) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            res.json({ success: false, message: "Invalid credentials" });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ success: false, message: "JWT secret is not configured" });
            return;
        }

        const token = jwt.sign({ id: doctor._id }, secret);

        res.json({ success: true, token });
    } catch (error: unknown) {
        console.error("Error logging in doctor:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
