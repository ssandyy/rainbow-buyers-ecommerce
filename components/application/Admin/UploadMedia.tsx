"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { CldUploadWidget } from "next-cloudinary"
import { Upload } from "lucide-react"
import { useState } from "react"
import { showToast } from "@/lib/showToast"

interface UploadMediaProps {
    isMultiple?: boolean
}

const UploadMedia = ({ isMultiple = false }: UploadMediaProps) => {
    const [folder, setFolder] = useState("")
    const [isUploading, setIsUploading] = useState(false)

    const handleOnError = (error: any) => {
        console.error("Upload error:", error)
        let errorMessage = "Upload failed"
        
        if (error?.error?.message) {
            errorMessage = error.error.message
        } else if (error?.message) {
            errorMessage = error.message
        } else if (typeof error === 'string') {
            errorMessage = error
        }
        
        showToast({ 
            type: "error", 
            message: errorMessage
        })
        setIsUploading(false)
    }

    const handleOnClose = () => {
        // Reset uploading state when modal is closed/cancelled
        setIsUploading(false)
    }

    const handleOnSuccess = async (result: any) => {
        try {
            console.log("Upload result:", result)
            const info = result?.info
            if (!info) {
                showToast({ type: "error", message: "No upload info received" })
                return
            }

            console.log("Upload info:", info)
            
            const mediaData = {
                asset_id: info.asset_id,
                public_id: info.public_id,
                secure_url: info.secure_url,
                thumbnail_url: info?.thumbnail_url || info?.secure_url,
                title: info?.original_filename,
                alt: info?.original_filename,
            }

            console.log("Sending media data:", mediaData)

            const response = await axios.post("/api/media", mediaData)
            console.log("Media API response:", response.data)
            
            if (response.data.success) {
                showToast({ type: "success", message: "Image uploaded successfully!" })
                document.dispatchEvent(new Event("media:updated"))
            } else {
                showToast({ type: "error", message: response.data.message || "Failed to save media" })
            }
        } catch (error: any) {
            console.error("Failed to persist media:", error)
            const errorMessage = error?.response?.data?.message || error?.message || "Failed to save media"
            showToast({ type: "error", message: errorMessage })
        } finally {
            setIsUploading(false)
        }
    }

    const handleUploadStart = () => {
        setIsUploading(true)
        console.log("Upload started...")
    }

    // Check if required environment variables are set
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_NAME
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME

    // Use the configured upload preset
    const finalUploadPreset = uploadPreset

    if (!finalUploadPreset || !cloudName) {
        return (
            <div className="p-4 border border-red-300 bg-red-50 rounded-lg">
                <p className="text-red-700 font-medium">Cloudinary Configuration Error</p>
                <p className="text-red-600 text-sm mt-1">
                    Missing required environment variables. Please check your .env.local file.
                </p>
                <div className="mt-2 text-xs text-red-500">
                    <p>Required: NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET</p>
                    <p>Required: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <CldUploadWidget
                uploadPreset={finalUploadPreset}
                signatureEndpoint="/api/uploadMedia"
                onError={handleOnError}
                onSuccess={handleOnSuccess}
                onOpen={handleUploadStart}
                onClose={handleOnClose}
                options={{
                    multiple: isMultiple,
                    sources: ["local", "url", "camera"],
                    folder: folder || undefined,
                    maxFiles: isMultiple ? 10 : 1,
                    resourceType: "image",
                    clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                    maxFileSize: 10000000, // 10MB
                }}
            >
                {({ open }) => (
                    <div className="flex items-center gap-3">
                        <Input
                            placeholder="Folder (optional)"
                            value={folder}
                            onChange={(e) => setFolder(e.target.value)}
                            className="w-48"
                        />
                        <Button
                            onClick={() => !isUploading && open()}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </div>
                )}
            </CldUploadWidget>
        </div>
    )
}

export default UploadMedia
