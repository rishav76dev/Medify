import { Request, Response } from "express";
import { DoctorModel } from "../models/doctorModel";

export const changeAvailability = async (req:Request, res:Response) => {
    try {
        const { docId } = req.body;

        const docData = await DoctorModel.findById(docId)
        await DoctorModel.findByIdAndUpdate(docId , {
            available: !docData?.available
        })
        res.json({
            success:true, message: 'Availabilty changed'
        })

    }catch (error){

    }
}