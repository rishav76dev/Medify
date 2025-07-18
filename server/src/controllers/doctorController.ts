import { Request, Response } from "express";
import { DoctorModel } from "../models/doctorModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { appointmentModel } from "../models/appointmentModel";

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

export const loginDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
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
      res
        .status(500)
        .json({ success: false, message: "JWT secret is not configured" });
      return;
    }

    const token = jwt.sign({ id: doctor._id }, secret);

    res.json({ success: true, token });
  } catch (error: unknown) {
    console.error("Error logging in doctor:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const appointmentsDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docId } = req.body;

    const appointments = await appointmentModel.find({ docId });

    res.json({ success: true, appointments });
  } catch (error: unknown) {
    console.error("Error fetching doctor appointments:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const appointmentComplete = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        isCompleted: true,
      });
      res.json({ success: true, message: "Appointment marked as completed" });
    } else {
      res.json({ success: false, message: "Marking as completed failed" });
    }
  } catch (error: unknown) {
    console.error("Error completing appointment:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const appointmentCancel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData && appointmentData.docId.toString() === docId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        cancelled: true,
      });
      res.json({ success: true, message: "Appointment cancelled" });
    } else {
      res.json({ success: false, message: "Cancellation failed" });
    }
  } catch (error: unknown) {
    console.error("Error cancelling appointment:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const doctorDashboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { docId } = req.body;
    const appointments = await appointmentModel.find({ docId });

    let earnings = 0;
    appointments.map((item) => {
      if (item.isCompleted || item.payment) {
        earnings += item.amount;
      }
    });

    let patients = [];
    appointments.map((item) => {
      if (!patients.includes(item.userId)) {
        patients.push(item.userId);
      }
    });

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.json({
      success: false,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};


export const doctorProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { docId } = req.body;

        const profileData = await DoctorModel.findById(docId).select("-password");

        res.json({ success: true, profileData });
    } catch (error: unknown) {
        console.error("Error fetching doctor profile:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};


export const updateDoctorProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { docId, fees, address, available } = req.body;

        await DoctorModel.findByIdAndUpdate(docId, {
            fees,
            address,
            available,
        });

        res.json({ success: true, message: "Profile updated" });
    } catch (error: unknown) {
        console.error("Error updating doctor profile:", error);
        res.json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred",
        });
    }
};
