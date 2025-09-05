import { catchError, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import User from "@/models/Users.model";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const token = cookieStore.get("access_token");

        if (!token) {
            return response({
                success: false,
                statusCode: 401,
                message: "No authentication token found",
                data: null,
            });
        }

        // Verify JWT
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(token.value, secret);

        // Get user data from database
        const user = await User.findById(payload._id).select('-password');
        
        if (!user) {
            return response({
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
            });
        }

        const userData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            isEmailVerified: user.isEmailVerified,
        };

        return response({
            success: true,
            statusCode: 200,
            message: "User data retrieved successfully",
            data: userData,
        });
    } catch (error: any) {
        console.error("❌ Get current user error:", error);
        
        // If JWT is expired or invalid, clear the cookie
        if (error.code === 'ERR_JWT_EXPIRED' || error.code === 'ERR_JWT_INVALID') {
            const cookieStore = await cookies();
            cookieStore.set("access_token", "", { 
                httpOnly: true, 
                path: "/", 
                expires: new Date(0) 
            });
        }
        
        return response({
            success: false,
            statusCode: 401,
            message: "Invalid or expired token",
            data: null,
        });
    }
}
