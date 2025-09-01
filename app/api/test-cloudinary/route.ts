import { NextRequest } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
    try {
        const config = {
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
            apiSecret: process.env.CLOUDINARY_API_SECRET ? "Set" : "Not set",
            uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NAME,
        }

        console.log("Cloudinary config check:", config)

        // Test if cloudinary is properly configured
        let cloudinaryTest = "Failed"
        try {
            if (cloudinary.config().cloud_name) {
                cloudinaryTest = "Success"
            }
        } catch (error) {
            cloudinaryTest = `Error: ${error}`
        }

        return new Response(
            JSON.stringify({
                success: true,
                config,
                cloudinaryTest,
                message: "Cloudinary configuration check completed"
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Cloudinary test failed:", error)
        return new Response(
            JSON.stringify({
                success: false,
                message: "Cloudinary test failed",
                error: error?.message || "Unknown error"
            }),
            { status: 500 }
        )
    }
}
