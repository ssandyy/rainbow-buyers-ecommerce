import { catchError, generateOTP, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { sendMail } from "@/lib/senMail";
import OTPModel from "@/models/Otp.model";
import User from "@/models/Users.model";
import z from "zod";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const payload = await request.json();

        const validationSchema = z.object({
            email: z.string().email()
        });

        const validatedData = validationSchema.safeParse(payload);
        if (!validatedData.success) {
            return response({ success: false, statusCode: 400, message: "Invalid email", data: validatedData.error });
        }

        const { email } = validatedData.data;

        const user = await User.findOne({ email });
        if (!user) {
            return response({ success: false, statusCode: 404, message: "User not found", data: null });
        }
        if (!user.isEmailVerified) {
            return response({ success: false, statusCode: 400, message: "Please verify your email before requesting OTP.", data: null });
        }

        await OTPModel.deleteMany({ email });
        const otp = generateOTP();
        await new OTPModel({ email, otp }).save();

        const result = await sendMail({
            subject: "OTP from Rainbow Buyer's",
            receiver: email,
            body: `Your OTP is ${otp}`
        });

        if (!result?.success) {
            return response({ success: false, statusCode: 400, message: "Failed to resend OTP. Try again.", data: null });
        }

        return response({ success: true, statusCode: 200, message: "OTP resent successfully", data: null });
    } catch (e: any) {
        return catchError(e);
    }
}