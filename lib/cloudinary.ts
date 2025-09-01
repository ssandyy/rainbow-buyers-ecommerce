import { v2 as cloudinary } from 'cloudinary'

// Validate required environment variables
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
    console.error('Missing required Cloudinary environment variables:')
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:', cloudName ? 'Set' : 'Missing')
    console.error('NEXT_PUBLIC_CLOUDINARY_API_KEY:', apiKey ? 'Set' : 'Missing')
    console.error('CLOUDINARY_API_SECRET:', apiSecret ? 'Set' : 'Missing')
}

cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret
})

export default cloudinary