"use client"

import { Button } from "@/components/ui/button"
import { CldUploadWidget } from "next-cloudinary"

interface UploadMediaProps {
    isMultiple?: boolean
}

const UploadMedia = ({ isMultiple = false }: UploadMediaProps) => {
    const handleOnError = (error: any) => {
        console.error("Upload error:", error)
    }

    const handleOnQueuesEnd = () => {
        console.log("All uploads finished ✅")
    }

    return (
        <CldUploadWidget
            signatureEndpoint="/api/uploadMedia"
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
            onError={handleOnError}
            onQueuesEnd={handleOnQueuesEnd}
            options={{
                multiple: isMultiple,
                sources: ["local", "url", "camera"], // add allowed sources
            }}

        >
            {({ open }) => (
                <Button
                    onClick={() => open()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
                >
                    Upload Image
                </Button>
            )}
        </CldUploadWidget>
    )
}

export default UploadMedia
