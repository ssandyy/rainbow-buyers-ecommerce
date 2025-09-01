import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const envVars = {
            DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
            MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
            MONGODB_URL: process.env.MONGODB_URL ? "Set" : "Not set",
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "Not set",
            NEXT_PUBLIC_CLOUDINARY_API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY ? "Set" : "Not set",
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "Not set",
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
            SECRET_KEY: process.env.SECRET_KEY ? "Set" : "Not set",
            NODE_ENV: process.env.NODE_ENV || "Not set"
        }

        console.log("Environment variables check:", envVars)

        return new Response(
            JSON.stringify({
                success: true,
                message: "Environment variables check completed",
                envVars
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Environment test failed:", error)
        return new Response(
            JSON.stringify({
                success: false,
                message: "Environment test failed",
                error: error?.message || "Unknown error"
            }),
            { status: 500 }
        )
    }
}
