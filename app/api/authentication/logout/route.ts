import { response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { cookies } from "next/headers";


export const POST = async (request: Request) => {
    try {
        await connectToDatabase();
        const cookieStore = await cookies()
        cookieStore.delete('access_token')
        return response({ success: true, statusCode: 200, message: "User logged out successfully", data: null })

    } catch (error) {
        console.log(error);
        return response({ success: false, statusCode: 500, message: "Something went wrong", data: null })
    }
}