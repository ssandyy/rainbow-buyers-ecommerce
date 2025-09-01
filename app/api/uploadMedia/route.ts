import cloudinary from "@/lib/cloudinary"
import { NextRequest } from "next/server"

export async function GET(req: NextRequest) {
    try {
        console.log("GET /api/uploadMedia - Generating signature")

        const params = req.nextUrl.searchParams
        const timestampParam = params.get("timestamp")
        const folderParam = params.get("folder") || undefined

        const timestamp = timestampParam
            ? parseInt(timestampParam, 10)
            : Math.round(Date.now() / 1000)

        // Check if required environment variables are set
        if (!process.env.CLOUDINARY_API_SECRET) {
            console.error("CLOUDINARY_API_SECRET is not set")
            return new Response(
                JSON.stringify({
                    message: "Cloudinary API secret not configured",
                }),
                { status: 500 }
            )
        }

        if (!process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY) {
            console.error("NEXT_PUBLIC_CLOUDINARY_API_KEY is not set")
            return new Response(
                JSON.stringify({
                    message: "Cloudinary API key not configured",
                }),
                { status: 500 }
            )
        }

        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
            console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set")
            return new Response(
                JSON.stringify({
                    message: "Cloudinary cloud name not configured",
                }),
                { status: 500 }
            )
        }

        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                ...(folderParam ? { folder: folderParam } : {}),
            },
            process.env.CLOUDINARY_API_SECRET
        )

        const response = {
            timestamp,
            signature,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
        }

        console.log("Signature generated successfully")
        return new Response(
            JSON.stringify(response),
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
        console.log("POST /api/uploadMedia - Processing upload")

        const body = await req.json()
        console.log("Request body:", body)

        // Check if required environment variables are set
        if (!process.env.CLOUDINARY_API_SECRET) {
            console.error("CLOUDINARY_API_SECRET is not set")
            return new Response(
                JSON.stringify({
                    message: "Cloudinary API secret not configured",
                }),
                { status: 500 }
            )
        }

        // next-cloudinary sends { paramsToSign: {...} }.
        // Fallback to body if paramsToSign is not provided.
        const incomingParams: Record<string, any> = body?.paramsToSign ?? body ?? {}
        const paramsToSign = {
            ...incomingParams,
            timestamp: incomingParams.timestamp ?? Math.round(Date.now() / 1000),
        }

        console.log("Parameters to sign:", paramsToSign)

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        )

        const response = {
            ...paramsToSign,
            signature,
            apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
        }

        console.log("Upload signature generated successfully")
        return new Response(
            JSON.stringify(response),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Upload signature generation failed:", error)
        return new Response(
            JSON.stringify({
                message: "Upload signature generation failed",
                error: error?.message || "Unknown error"
            }),
            { status: 400 }
        )
    }
}