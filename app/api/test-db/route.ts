import { NextRequest } from "next/server"
import connectToDatabase from "@/lib/dbconnection"

export async function GET(req: NextRequest) {
    try {
        console.log("Testing database connection...")
        
        // Check if DATABASE_URL or MONGODB_URI is set
        const databaseUrl = process.env.DATABASE_URL || process.env.MONGODB_URI
        if (!databaseUrl) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "DATABASE_URL or MONGODB_URI environment variable is not set",
                    config: {
                        DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
                        MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set"
                    }
                }),
                { status: 500, headers: { "Content-Type": "application/json" } }
            )
        }

        // Try to connect to database
        const connection = await connectToDatabase()
        
        return new Response(
            JSON.stringify({
                success: true,
                message: "Database connection successful",
                config: {
                    DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
                    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set",
                    connectionState: connection.readyState === 1 ? "Connected" : "Disconnected"
                }
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        )
    } catch (error: any) {
        console.error("Database test failed:", error)
        return new Response(
            JSON.stringify({
                success: false,
                message: "Database connection failed",
                error: error?.message || "Unknown error",
                config: {
                    DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
                    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not set"
                }
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        )
    }
}
