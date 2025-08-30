"use client"

import axios from "axios"
import { CldUploadWidget } from "next-cloudinary"
import { useState } from "react"

interface UploadMediaProps {
    isMultiple?: boolean
}

const UploadMedia = ({ isMultiple = false }: UploadMediaProps) => {
    const [folder, setFolder] = useState("")

    const handleOnError = (error: any) => {
        console.error("Upload error:", error)
    }

    const handleOnSuccess = async (result: any) => {
        try {
            const info = result?.info
            if (!info) return

            await axios.post("/api/media", {
                asset_id: info.asset_id,
                public_id: info.public_id,
                secure_url: info.secure_url,
                thumbnail_url: info?.thumbnail_url || info?.secure_url,
                title: info?.original_filename,
                alt: info?.original_filename,
            })
            document.dispatchEvent(new Event("media:updated"))
        } catch (error) {
            console.error("Failed to persist media:", error)
        }
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/uploadMedia"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onSuccess={handleOnSuccess}
            options={{
                multiple: isMultiple,
                sources: ["local", "url", "camera"],
                folder: folder || undefined,
            }}

        >
            {({ open }) => (
                <div className="flex items-center gap-2">
                    <input
                        className="border px-2 py-1 rounded"
                        placeholder="Folder (optional)"
                        value={folder}
                        onChange={(e) => setFolder(e.target.value)}
                    />
                    <div
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow cursor-pointer"
                        onClick={() => open()}
                    >
                        Upload Image
                    </div>
                </div>
            )}
        </CldUploadWidget>
    )
}

export default UploadMedia
