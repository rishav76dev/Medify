import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const atokenHeader = req.headers.atoken;
        const atoken = Array.isArray(atokenHeader) ? atokenHeader[0] : atokenHeader;

        if (!atoken) {
            res.status(401).json({ success: false, message: "Not authorized, login again" });
            return;
        }

        if (!process.env.JWT_SECRET) {
            res.status(500).json({ success: false, message: "JWT secret is not configured" });
            return;
        }
        if (!process.env.ADMIN_EMAIL) {
            res.status(500).json({ success: false, message: "Admin email is not configured" });
            return;
        }

        const decoded = jwt.verify(atoken, process.env.JWT_SECRET) as jwt.JwtPayload;

        if (!decoded || decoded.email !== process.env.ADMIN_EMAIL) {
            res.status(401).json({ success: false, message: "Not authorized, login again" });
            return;
        }

        next();
    } catch (error) {
        console.error("Admin authentication error:", error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred while verifying admin"
        });
    }
};
