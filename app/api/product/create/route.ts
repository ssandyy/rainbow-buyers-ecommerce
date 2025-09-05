import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { productSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import CategoryModel from "@/models/Category.model";
import MediaModel from "@/models/Media.model";
import slugify from "slugify";

async function generateUniqueSlug(baseName: string) {
    const base = slugify(baseName, { lower: true, strict: true, trim: true });
    let candidate = base;
    let suffix = 1;
    
    while (await ProductModel.findOne({ slug: candidate })) {
        candidate = `${base}-${suffix}`;
        suffix++;
    }
    return candidate;
}

export async function POST(req: Request) {
    try {
        console.log('Product create API called');

        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('Authentication failed for product creation');
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }
        console.log('Authentication successful for product creation');

        await connectToDatabase();
        console.log('Database connected for product creation');

        const payload = await req.json();
        console.log('Received payload:', payload);

        // Validate the payload
        const parsed = productSchema.safeParse(payload);
        if (!parsed.success) {
            console.log('Validation failed:', parsed.error);
            return response({ 
                success: false, 
                statusCode: 400, 
                message: "Invalid data", 
                data: parsed.error.issues 
            });
        }

        const { name, description, category, mrp, sellingPrice, discount, media } = parsed.data;
        
        // Generate unique slug
        const slug = await generateUniqueSlug(name);

        // Validate categories exist
        const categoryExists = await CategoryModel.find({ _id: { $in: category } });
        if (categoryExists.length !== category.length) {
            return response({ 
                success: false, 
                statusCode: 400, 
                message: "One or more categories not found" 
            });
        }

        // Validate media exists
        const mediaExists = await MediaModel.find({ _id: { $in: media } });
        if (mediaExists.length !== media.length) {
            return response({ 
                success: false, 
                statusCode: 400, 
                message: "One or more media files not found" 
            });
        }

        // Create the product
        const newProduct = await ProductModel.create({
            name,
            slug,
            description,
            category: category[0], // Take first category as primary
            mrp,
            sellingPrice,
            discount,
            media
        });

        console.log('Product created successfully:', newProduct._id);

        return response({ 
            success: true, 
            statusCode: 201, 
            message: "Product created successfully", 
            data: newProduct 
        });

    } catch (error: any) {
        console.error('Error creating product:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}
