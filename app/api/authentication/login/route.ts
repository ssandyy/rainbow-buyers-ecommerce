import { EmailVerificationLink } from "@/app/email/emailVarification";
import { catchError, generateOTP, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { sendMail } from "@/lib/senMail";
import OTPModel from "@/models/Otp.model";
import User from "@/models/Users.model";
import { SignJWT } from "jose";
import z from "zod";

export async function POST(request: Request) {
    try {
        await connectToDatabase();
        const payload = await request.json();

        const validationSchema = z.object({
            email: z.string().email()
        }).extend({
            password: z.string().min(8)
        })

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response({
                success: false,
                statusCode: 400,
                data: validatedData.error,
                message: `Invalid data ${validatedData.error}`,
            })
        }

        const { email, password } = validatedData.data;

        // get user from database WITH password selected
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid Credentials, please enter correct credentials..!",
                data: null
            })
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid Credentials, please enter correct credentials..!",
                data: null
            })
        }

        // If email not verified, send verification link and stop here
        if (!user.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);
            const token = await new SignJWT({ userId: user._id.toString() })
                .setIssuedAt()
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("1h")
                .sign(secret);

            await sendMail({
                subject: "Email Verification Request from Rainbow Buyer's",
                receiver: email as string,
                body: EmailVerificationLink({ link: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/verify-email/${token}` })
            });

            return response({
                success: false,
                statusCode: 400,
                message: "Please verify your email..!, check your email for verification link..!",
                data: null
            })
        }

        // Verified user → send OTP for secure login
        await OTPModel.deleteMany({ email });
        const otp = generateOTP();
        const newOtpData = new OTPModel({ email, otp });
        await newOtpData.save();

        const otpEmailStatus = await sendMail({
            subject: "OTP from Rainbow Buyer's",
            receiver: email as string,
            body: `Your OTP is ${otp}`
        });

        if (!otpEmailStatus?.success) {
            return response({
                success: false,
                statusCode: 400,
                message: "Something went wrong. Please try again later.",
                data: null
            })
        }

        return response({
            success: true,
            statusCode: 200,
            message: "OTP sent successfully",
            data: null
        })
    } catch (e: any) {
        return catchError(e);
    }
}