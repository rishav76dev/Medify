import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import { DoctorModel } from "../models/doctorModel";
import jwt from "jsonwebtoken";

export const addDoctor = async (req: Request, res: Response): Promise<void> => {
    const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
    const imageFile = req.file;

    try {
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }

        if (!imageFile) {
            res.status(400).json({ success: false, message: "Doctor image is required" });
            return;
        }

        if (!validator.isEmail(email)) {
            res.status(400).json({ success: false, message: "Please enter a valid email" });
            return;
        }

        if (password.length < 8) {
            res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
            return;
        }

        const existingDoctor = await DoctorModel.findOne({ email });
        if (existingDoctor) {
            res.status(400).json({ success: false, message: "Doctor with this email already exists" });
            return;
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

        await DoctorModel.create(doctorData);

        res.status(201).json({
            success: true,
            message: "New doctor added",
        });

    } catch (error) {
        console.error("Error adding doctor:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred while adding doctor"
        });
    }
};

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            if (!process.env.JWT_SECRET) {
                res.status(500).json({ success: false, message: "JWT secret is not configured" });
                return;
            }

            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });

            res.status(200).json({
                success: true,
                token,
            });
            return;
        }

        res.status(401).json({
            success: false,
            message: "Invalid credentials",
        });

    } catch (error) {
        console.error("Error logging in admin:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred while logging in"
        });
    }
};

export const allDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
        const doctors = await DoctorModel.find({}).select('-password');

        res.status(200).json({
            success: true,
            doctors,
        });

    } catch (error) {
        console.error("Failed getting doctors data:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred while fetching doctors"
        });
    }
};
