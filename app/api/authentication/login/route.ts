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
            email: true
        }).extend({
            password: z.string().min(8)
        })

        const validatedData = validationSchema.safeParse(payload);

        if (!validatedData.success) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid data",
                data: validatedData.error
            })
        }

        const { email, password } = validatedData.data;

        //get user from database
        const user = await User.findOne({ email });

        if (!user) {
            return response({
                success: false,
                statusCode: 400,
                message: "Invalid Credentials, please enter correct credentials..!",
                // message: "Please check your email..!",
                data: null
            })
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return response({
                success: false,
                statusCode: 400,
                // message: "Please check your password..!",
                message: "Invalid Credentials, please enter correct credentials..!",
                data: null
            })
        }

        // verify user email if not verified before 
        if (!user.isEmailVerified) {
            const secret = new TextEncoder().encode(process.env.SECRET_KEY);

            // Convert userId to string to avoid buffer issues
            const token = await new SignJWT({
                userId: user._id.toString() // Convert to string here!
            })
                .setIssuedAt()
                .setProtectedHeader({ alg: "HS256" })
                .setExpirationTime("1hr")
                .sign(secret);

            console.log("✅ User registered:", user._id.toString());
            console.log("🔑 Token generated for verification");

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

        return response({
            success: true,
            statusCode: 200,
            message: "Login successfully",
            data: null
        })


        // first delete any old  OPT
        await OTPModel.deleteMany({ email }); // delete all previous otps of user


        // generate OTP in helpper function 
        const otp = generateOTP();

        // storing otp in databse 
        const newOtpData = new OTPModel({ email, otp })
        await newOtpData.save();

        const otpEmailStatus = await sendMail({
            subject: "OTP from Rainbow Buyer's",
            receiver: email as string,
            body: `Your OTP is ${otp}`
        })

        // await sendMail('your login verification ', email, otpEmail(otp));

        if (!otpEmailStatus) {
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