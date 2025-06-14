import { Request, Response } from "express";
import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary} from "cloudinary";
import { DoctorModel } from "../models/doctorModel";
import * as jwt from "jsonwebtoken";


export const addDoctor = async (req: Request, res: Response) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Doctor image is required"
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long"
            });
        }

        const existingDoctor = await DoctorModel.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({
                success: false,
                message: "Doctor with this email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            image: imageUrl,
            date: Date.now()
        };

        const newDoctor = new DoctorModel(doctorData);
        await newDoctor.save();

        res.status(201).json({
            success: true,
            message: "New doctor added"
        });

    } catch (error: unknown) {
        console.error("Error adding doctor:", error);
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred while adding doctor"
            });
        }
    }
};

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({
                    success: false,
                    message: "JWT secret is not configured"
                });
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

            return res.json({
                success: true,
                token
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid credentials"
        });

    } catch (error: unknown) {
        console.error("Error logging in admin:", error);
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        } else {
            res.status(500).json({
                success: false,
                message: "An unknown error occurred while logging in"
            });
        }
    }
};
