import { catchError, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import OTPModel from "@/models/Otp.model";
import User from "@/models/Users.model";
import z from "zod";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const payload = await request.json();

        const validationSchema = z.object({
            email: z.string().email(),
            otp: z.string().min(4).max(6)
        });

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid data",
                data: validatedData.error
            });
        }

        const { email, otp } = validatedData.data;

        // Validate user exists
        const user = await User.findOne({ email });
        if (!user) {
            return response({
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null
            });
        }

        // Find valid OTP (not expired)
        const otpRecord = await OTPModel.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() }
        });

        if (!otpRecord) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid or expired OTP",
                data: null
            });
        }


        await OTPModel.deleteOne({ _id: otpRecord._id });

        return response({
            success: true,
            statusCode: 200,
            message: "OTP verified. Login successful.",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (e: any) {
        return catchError(e);
    }
}