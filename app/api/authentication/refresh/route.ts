import { catchError, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import User from "@/models/Users.model";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function POST() {
    try {
        await connectToDatabase();

        const cookieStore = await cookies();
        const refreshToken = cookieStore.get("refresh_token");

        if (!refreshToken) {
            return response({
                success: false,
                statusCode: 401,
                message: "No refresh token found",
                data: null,
            });
        }

        // Verify refresh token
        const secret = new TextEncoder().encode(process.env.SECRET_KEY);
        const { payload } = await jwtVerify(refreshToken.value, secret);

        // Get user data from database
        const user = await User.findById(payload.userId).select('-password');
        
        if (!user) {
            return response({
                success: false,
                statusCode: 404,
                message: "User not found",
                data: null,
            });
        }

        // Create new access token
        const loggedInUserData = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
        };

        const newAccessToken = await new SignJWT(loggedInUserData)
            .setIssuedAt()
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime("24h")
            .sign(secret);

        // Set new access token cookie
        cookieStore.set("access_token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 24 hours
        });

        return response({
            success: true,
            statusCode: 200,
            message: "Token refreshed successfully",
            data: loggedInUserData,
        });
    } catch (error: any) {
        console.error("❌ Token refresh error:", error);
        
        // If refresh token is expired or invalid, clear both cookies
        if (error.code === 'ERR_JWT_EXPIRED' || error.code === 'ERR_JWT_INVALID') {
            const cookieStore = await cookies();
            cookieStore.set("access_token", "", { 
                httpOnly: true, 
                path: "/", 
                expires: new Date(0) 
            });
            cookieStore.set("refresh_token", "", { 
                httpOnly: true, 
                path: "/", 
                expires: new Date(0) 
            });
        }
        
        return response({
            success: false,
            statusCode: 401,
            message: "Invalid or expired refresh token",
            data: null,
        });
    }
}

