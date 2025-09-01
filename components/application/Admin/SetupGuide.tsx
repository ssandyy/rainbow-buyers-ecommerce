"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { showToast } from "@/lib/showToast"

const SetupGuide = () => {
    const [showAdvanced, setShowAdvanced] = useState(false)
    const [cloudName, setCloudName] = useState("")
    const [uploadPreset, setUploadPreset] = useState("")

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        showToast({ type: "success", message: "Copied to clipboard!" })
    }

    const generateEnvFile = () => {
        const envContent = `# Database Configuration
DATABASE_URL=mongodb://localhost:27017/rainbowbuyers

# JWT Secret
SECRET_KEY=your-secret-key-here-change-this-in-production

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${cloudName || 'your-cloud-name'}
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=${uploadPreset || 'your-upload-preset'}

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Email Configuration (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password`

        copyToClipboard(envContent)
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Environment Setup Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2">1. Database Setup</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        You need a MongoDB database. Choose one option:
                    </p>
                    <div className="space-y-2">
                        <div className="p-3 bg-blue-50 rounded border">
                            <h4 className="font-medium">Option A: Local MongoDB</h4>
                            <p className="text-sm text-gray-600">Install MongoDB locally or use Docker</p>
                            <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
                                DATABASE_URL=mongodb://localhost:27017/rainbowbuyers
                            </code>
                        </div>
                        <div className="p-3 bg-green-50 rounded border">
                            <h4 className="font-medium">Option B: MongoDB Atlas (Recommended)</h4>
                            <p className="text-sm text-gray-600">Free cloud database at mongodb.com/atlas</p>
                            <code className="text-xs bg-gray-100 p-1 rounded block mt-1">
                                DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/rainbowbuyers
                            </code>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">2. Cloudinary Setup</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Create a free account at cloudinary.com and get your credentials:
                    </p>
                    
                    <div className="space-y-3">
                        <div>
                            <Label htmlFor="cloudName">Cloud Name</Label>
                            <Input
                                id="cloudName"
                                value={cloudName}
                                onChange={(e) => setCloudName(e.target.value)}
                                placeholder="e.g., dw6nhe1ge"
                            />
                        </div>
                        <div>
                            <Label htmlFor="uploadPreset">Upload Preset</Label>
                            <Input
                                id="uploadPreset"
                                value={uploadPreset}
                                onChange={(e) => setUploadPreset(e.target.value)}
                                placeholder="e.g., my-upload-preset"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Create this in Cloudinary Dashboard → Settings → Upload → Upload Presets
                            </p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">3. Create .env.local File</h3>
                    <p className="text-sm text-gray-600 mb-2">
                        Create a file named `.env.local` in your project root with these variables:
                    </p>
                    
                    <Button onClick={generateEnvFile} className="w-full">
                        Generate .env.local Content
                    </Button>
                    
                    <p className="text-xs text-gray-500 mt-2">
                        Click the button above to copy the environment variables to your clipboard, then paste them into a new `.env.local` file.
                    </p>
                </div>

                <div>
                    <h3 className="font-semibold mb-2">4. Restart Development Server</h3>
                    <p className="text-sm text-gray-600">
                        After creating the `.env.local` file, restart your development server:
                    </p>
                    <code className="text-xs bg-gray-100 p-2 rounded block mt-1">
                        npm run dev
                    </code>
                </div>

                <Button 
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    variant="outline"
                    className="w-full"
                >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Configuration
                </Button>

                {showAdvanced && (
                    <div className="p-4 bg-gray-50 rounded border">
                        <h4 className="font-medium mb-2">Advanced Configuration</h4>
                        <div className="space-y-2 text-sm">
                            <div>
                                <strong>JWT Secret:</strong> Generate a random string for SECRET_KEY
                            </div>
                            <div>
                                <strong>Email Setup:</strong> Configure SMTP settings for email verification
                            </div>
                            <div>
                                <strong>Cloudinary API Key/Secret:</strong> Only needed for server-side operations
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default SetupGuide
