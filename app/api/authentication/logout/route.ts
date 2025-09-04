import { NextResponse } from "next/server";

export async function POST() {
    try {
        // Delete cookie by setting it to empty + expired
        const response = NextResponse.json(
            { success: true, message: "Logged out successfully" },
            { status: 200 }
        );

        response.cookies.set({
            name: "access_token",
            value: "",
            httpOnly: true,
            path: "/",
            expires: new Date(0), // Expire immediately
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: ` Something went wrong, ${error}` },
            { status: 500 }
        );
    }
}
