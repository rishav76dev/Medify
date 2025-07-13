import { Request, Response } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import { userModel } from "../models/userModel";

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
