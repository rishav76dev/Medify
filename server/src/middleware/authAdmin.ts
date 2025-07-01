import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const authAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const atokenHeader = req.headers.atoken;

        if (!atokenHeader) {
            return res.json({ success: false, message: 'Not authorized, login again' });
        }

        const atoken = Array.isArray(atokenHeader) ? atokenHeader[0] : atokenHeader;

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "JWT secret is not configured" });
        }
        if (!process.env.ADMIN_PASSWORD) {
            return res.status(500).json({ success: false, message: "Admin password is not configured" });
        }
        if (!process.env.ADMIN_EMAIL) {
            return res.status(500).json({ success: false, message: "Admin email is not configured" });
        }

        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (
            !token_decode ||
            token_decode.email !== process.env.ADMIN_EMAIL ||
            token_decode.password !== process.env.ADMIN_PASSWORD
        ) {
            return res.json({
                success: false,
                message: 'Not Authorized, login again'
            });
        }

        next();
    } catch (error: unknown) {
        console.error("Please login the admin :", error);
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
}
