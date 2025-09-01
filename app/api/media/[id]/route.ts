import { NextRequest } from "next/server"
import connectToDatabase from "@/lib/dbconnection"
import MediaModel from "@/models/Media.model"

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase()
        const body = await req.json()
        
        console.log("Media PATCH request for ID:", params.id, "Body:", body)
        
        const { title, alt } = body
        
        // Validate the media item exists
        const existingMedia = await MediaModel.findById(params.id)
        if (!existingMedia) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "Media not found" 
            }), { status: 404 })
        }

        // Update only allowed fields
        const updateData: any = {}
        if (title !== undefined) updateData.title = title
        if (alt !== undefined) updateData.alt = alt

        const updatedMedia = await MediaModel.findByIdAndUpdate(
            params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )

        console.log("Media updated successfully:", updatedMedia._id)

        return new Response(JSON.stringify({ 
            success: true, 
            data: updatedMedia,
            message: "Media updated successfully"
        }), { status: 200 })
    } catch (error: any) {
        console.error("Failed to update media:", error)
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Failed to update media", 
            error: error?.message || "Unknown error" 
        }), { status: 500 })
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase()
        
        const media = await MediaModel.findById(params.id).lean()
        if (!media) {
            return new Response(JSON.stringify({ 
                success: false, 
                message: "Media not found" 
            }), { status: 404 })
        }

        return new Response(JSON.stringify({ 
            success: true, 
            data: media
        }), { status: 200 })
    } catch (error: any) {
        console.error("Failed to fetch media:", error)
        return new Response(JSON.stringify({ 
            success: false, 
            message: "Failed to fetch media", 
            error: error?.message || "Unknown error" 
        }), { status: 500 })
    }
}
