import connectToDatabase from "@/lib/dbconnection";
import CategoryModel from "@/models/Category.model";

export async function GET() {
    try {
        await connectToDatabase();
        
        // Test if we can connect and query the database
        const categoryCount = await CategoryModel.countDocuments();
        
        // Test fetching all categories
        const allCategories = await CategoryModel.find({ deleted_At: null }).lean();
        
        return Response.json({
            success: true,
            message: "Database connection successful",
            categoryCount,
            allCategories,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database connection error:', error);
        return Response.json({
            success: false,
            message: "Database connection failed",
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
