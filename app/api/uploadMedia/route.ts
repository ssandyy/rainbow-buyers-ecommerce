import cloudinary from "@/lib/cloudinary"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const params = req.nextUrl.searchParams
        const timestampParam = params.get("timestamp")
        const folderParam = params.get("folder") || undefined

        const timestamp = timestampParam
            ? parseInt(timestampParam, 10)
            : Math.round(Date.now() / 1000)

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                ...(folderParam ? { folder: folderParam } : {}),
            },
            process.env.CLOUDINARY_API_SECRET as string // ✅ use server-only secret
        )

        return new Response(
            JSON.stringify({
                timestamp,
                signature,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Signature generation failed:", error)
        return new Response(
            JSON.stringify({
                message: "Signature generation failed",
                error: error?.message || "Unknown error",
            }),
            { status: 500 }
        )
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        const paramsToSign = {
            ...body, // 👈 includes source=uw, folder, etc.
            timestamp: Math.round(Date.now() / 1000),
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        )

        return new Response(
            JSON.stringify({
                ...paramsToSign,
                signature,
                apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
                cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Signature generation failed:", error)
        return new Response(
            JSON.stringify({ message: "Signature generation failed", error: error?.message }),
            { status: 400 }
        )
    }
}
