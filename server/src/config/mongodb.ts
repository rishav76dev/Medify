import mongoose from "mongoose";

import * as dotenv from 'dotenv';
dotenv.config();

export const connectDB = async(): Promise<void> => {
    try {
        const mongoUri = process.env.MONGO_URI;

        if (!mongoUri) {
            throw new Error('MONGO_URI environment variable is not defined');
        }

        await mongoose.connect(mongoUri);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error);
        throw error; // Re-throw to let the caller handle it
    }
}
