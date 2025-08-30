import { NextRequest } from "next/server"
import connectToDatabase from "@/lib/dbconnection"
import MediaModel from "@/models/Media.model"
import cloudinary from "@/lib/cloudinary"

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase()
        const searchParams = req.nextUrl.searchParams
        const includeDeleted = (searchParams.get("includeDeleted") || "false").toLowerCase() === "true"
        const q = (searchParams.get("q") || "").trim()
        const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1)
        const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "24", 10), 1), 100)

        const query: any = includeDeleted ? {} : { deleted: null }
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { public_id: { $regex: q, $options: "i" } },
            ]
        }

        const total = await MediaModel.countDocuments(query)
        const medias = await MediaModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()

        return new Response(
            JSON.stringify({ success: true, data: medias, total, page, limit, pages: Math.ceil(total / limit) }),
            { status: 200 }
        )
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, message: "Failed to fetch media", error: error?.message || "Unknown error" }), { status: 500 })
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await connectToDatabase()
        const body = await req.json()
        const ids: string[] = body?.ids || []
        const action: "soft-delete" | "restore" = body?.action

        if (!Array.isArray(ids) || ids.length === 0 || !action) {
            return new Response(JSON.stringify({ success: false, message: "ids[] and action are required" }), { status: 400 })
        }

        if (action === "soft-delete") {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deleted: new Date() } })
        } else if (action === "restore") {
            await MediaModel.updateMany({ _id: { $in: ids } }, { $set: { deleted: null } })
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, message: "Failed to update media", error: error?.message || "Unknown error" }), { status: 500 })
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase()
        const body = await req.json()
        const ids: string[] = body?.ids || []
        if (!Array.isArray(ids) || ids.length === 0) {
            return new Response(JSON.stringify({ success: false, message: "ids[] are required" }), { status: 400 })
        }

        const docs = await MediaModel.find({ _id: { $in: ids } }).lean()
        const publicIds = docs.map((d: any) => d.public_id).filter(Boolean)

        if (publicIds.length > 0) {
            await Promise.all(
                publicIds.map((pid) => cloudinary.uploader.destroy(pid).catch(() => null))
            )
        }

        await MediaModel.deleteMany({ _id: { $in: ids } })

        return new Response(JSON.stringify({ success: true }), { status: 200 })
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, message: "Failed to delete media", error: error?.message || "Unknown error" }), { status: 500 })
    }
}

