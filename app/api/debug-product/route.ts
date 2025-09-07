import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import ProductModel from "@/models/Product.model";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log('=== DEBUG PRODUCT API ===');
        
        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('❌ Authentication failed');
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }
        
        console.log('✅ Authentication successful');
        await connectToDatabase();
        console.log('✅ Database connected');

        // Get all products without any filters
        const allProducts = await ProductModel.find({}).lean();
        console.log('📊 All products found:', allProducts.length);
        
        // Get active products
        const activeProducts = await ProductModel.find({ deleted_At: null }).lean();
        console.log('📊 Active products found:', activeProducts.length);
        
        // Get products with populate
        const populatedProducts = await ProductModel.find({ deleted_At: null })
            .populate('category', 'name slug')
            .populate('media', 'path thumbnail_url title')
            .lean();
        console.log('📊 Populated products found:', populatedProducts.length);

        // Sample product data
        const sampleProduct = activeProducts[0];
        console.log('📋 Sample product:', sampleProduct);

        // Test the exact query that the main API uses
        const query = { deleted_At: null };
        const sort = { createdAt: -1 };
        const start = 0;
        const size = 10;

        const [docs, total] = await Promise.all([
            ProductModel.find(query)
                .sort(sort)
                .skip(Math.max(0, start))
                .limit(Math.max(1, size))
                .populate('category', 'name slug')
                .populate('media', 'path thumbnail_url title')
                .lean(),
            ProductModel.countDocuments(query)
        ]);

        console.log('📊 Main query results - docs:', docs.length, 'total:', total);

        // Normalize category fields
        const rows = docs.map((d: any) => {
            const hasCategoryObj = d.category && typeof d.category === 'object' && 'name' in d.category;
            const categoryName = hasCategoryObj ? (d.category as any).name : '-';
            const categoryId = hasCategoryObj ? String((d.category as any)._id) : (d.category ? String(d.category) : null);
            return { ...d, categoryId, categoryName };
        });

        console.log('📊 Processed rows:', rows.length);
        console.log('📋 Sample processed row:', rows[0]);

        const finalResponse = {
            success: true,
            statusCode: 200,
            message: 'ok',
            data: { data: rows, meta: { totalRowCount: total } }
        };

        console.log('📤 Final response structure:', JSON.stringify(finalResponse, null, 2));

        return response(finalResponse);

    } catch (error: any) {
        console.error('❌ Error in debug product API:', error);
        console.error('❌ Error stack:', error.stack);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: { error: error.message, stack: error.stack }
        });
    }
}

