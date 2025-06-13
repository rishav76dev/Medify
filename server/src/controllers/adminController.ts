import { Request, Response } from "express";

export const addDoctor = async (req: Request, res: Response) =>{
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;
    } catch (error) {
        
    }
}