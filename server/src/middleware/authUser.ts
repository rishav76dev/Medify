import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    iat?: number;
    exp?: number;
}

const authUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const tokenHeader = req.headers.utoken;
        const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

        if (!token) {
            res.status(403).json({ success: false, message: "Not authorized. Login again." });
            return;
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            res.status(500).json({ success: false, message: "JWT secret is not configured." });
            return;
        }

        const decoded = jwt.verify(token, secret) as JwtPayload;
        req.body.userId = decoded.id;

        next();
    } catch (error: unknown) {
        console.error("Auth user error:", error);
        res.status(403).json({
            success: false,
            message: error instanceof Error ? error.message : "An unknown error occurred during authentication",
        });
    }
};

export default authUser;
