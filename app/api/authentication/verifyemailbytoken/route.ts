import connectToDatabase from "@/lib/dbconnection";
import User from "@/models/Users.model";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await connectToDatabase();

        const { token } = await request.json();

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Missing token" },
                { status: 400 }
            );
        }

        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const decoded = await jwtVerify(token, secret);
        console.log("🔑 Decoded token payload:", decoded.payload);

        // Extract userId from the token payload (should be a string)
        const userId = decoded.payload.userId;

        if (!userId) {
            return NextResponse.json(
                { success: false, message: "Invalid token format" },
                { status: 400 }
            );
        }

        console.log("🔑 Extracted userId:", userId);

        // Find user by ID
        const user = await User.findById(userId);
        console.log("👤 User found:", user?._id);

        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        // if already verified
        if (user.isEmailVerified) {
            return NextResponse.json(
                { success: true, message: "Email already verified" },
                { status: 200 }
            );
        }

        // update verification status
        user.isEmailVerified = true;
        await user.save();

        return NextResponse.json(
            { success: true, message: "Email verification successful" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("❌ verifyemailbytoken error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message || "Internal server error",
                error: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({ message: "API route is working ✅" });
}