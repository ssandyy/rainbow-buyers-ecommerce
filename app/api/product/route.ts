import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        console.log('Product list API called');

        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('Authentication failed for product listing');
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }

        await connectToDatabase();
        console.log('Database connected for product listing');

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Get products with pagination
        const products = await ProductModel.find({ deleted_At: null })
            .populate('category', 'name slug')
            .populate('media', 'path thumbnail_url title')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await ProductModel.countDocuments({ deleted_At: null });

        console.log(`Found ${products.length} products`);

        return response({
            success: true,
            statusCode: 200,
            message: "Products retrieved successfully",
            data: {
                data: products,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            }
        });

    } catch (error: any) {
        console.error('Error fetching products:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}
