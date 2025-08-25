import { EmailVerificationLink } from "@/app/email/emailVarification";
import { catchError, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { sendMail } from "@/lib/senMail";
import { zSchema } from "@/lib/zodSchema";
import UsersModel from "@/models/Users.model";
import { SignJWT } from "jose";

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const validateSchema = zSchema.pick({
            name: true,
            email: true,
            password: true
        })

        const payload = await req.json();
        const validatedData = validateSchema.safeParse(payload);

        //if validated data is not valid
        if (!validatedData.success) {
            return response({ success: false, statusCode: 401, message: "Data not valid..please try again..!", data: validatedData.error.issues[0].message });
        }
        //if validated data is valid 
        const { name, email, password } = validatedData.data;

        //check if user already exist 
        const userAlreadyExist = await UsersModel.exists({ email });
        if (userAlreadyExist) {
            return response({ success: false, statusCode: 409, message: "User already exist..!" });
        }

        //new registration
        const user = await UsersModel.create({ name, email, password });

        //Email verification by token 
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
            receiver: email,
            body: EmailVerificationLink({ link: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/auth/verify-email/${token}` })
        });

        return response({ success: true, statusCode: 201, message: "Registration successfull, Welcome to Rainbow Family..!", data: user });

    } catch (err) {
        console.error("❌ Registration error:", err);
        return catchError({ error: err, customMessage: "Registration failed" });
    }
}