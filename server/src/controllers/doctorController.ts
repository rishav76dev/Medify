import { Request, Response } from "express";
import { DoctorModel } from "../models/doctorModel";

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

