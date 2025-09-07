import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import ProductModel from "@/models/Product.model";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('Test products API called');
        
        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('Authentication failed');
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }
        
        console.log('Authentication successful');
        await connectToDatabase();
        console.log('Database connected');

        // Get all products without any filters
        const allProducts = await ProductModel.find({}).lean();
        console.log('All products found:', allProducts.length);
        console.log('Sample product:', allProducts[0]);

        // Get products without deleted_At
        const activeProducts = await ProductModel.find({ deleted_At: null }).lean();
        console.log('Active products found:', activeProducts.length);

        return response({
            success: true,
            statusCode: 200,
            message: 'Test successful',
            data: {
                allProducts: allProducts.length,
                activeProducts: activeProducts.length,
                sampleProduct: allProducts[0] || null
            }
        });

    } catch (error: any) {
        console.error('Error in test products API:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: { error: error.message }
        });
    }
}

