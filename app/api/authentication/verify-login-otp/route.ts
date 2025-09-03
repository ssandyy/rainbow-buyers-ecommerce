import { catchError, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import OTPModel from "@/models/Otp.model";
import User from "@/models/Users.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import z from "zod";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const payload = await request.json();

        const validationSchema = z.object({
            email: z.string().email(),
            otp: z.string().min(4).max(6),
        });

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid data",
                data: validatedData.error,
            });
        }

        const { email, otp } = validatedData.data;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return response({
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
            });
        }

        // Check OTP
        const otpRecord = await OTPModel.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() },
        });

        if (!otpRecord) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid or expired OTP",
                data: null,
            });
        }

        // Payload for JWT
        const loggedInUserData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        };

        // Sign JWT
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const token = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("1h")
            .sign(secret);

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        // Cleanup OTP
        await OTPModel.deleteOne({ _id: otpRecord._id });

        return response({
            success: true,
            statusCode: 200,
            message: "OTP verified. Login successful.",
            data: loggedInUserData,
        });
    } catch (e: any) {
        return catchError(e);
    }
}
