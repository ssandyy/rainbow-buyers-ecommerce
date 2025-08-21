import { connectToDatabase } from "@/lib/dbconnection";
import { NextResponse } from "next/server";

export async function GET() {
    await connectToDatabase();
    return NextResponse.json({
        success: true,
        message: "MongoDB connection success..!"
    });
}
