import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import CategoryModel from "@/models/Category.model";
import { NextRequest } from "next/server";
import slugify from "slugify";

export const dynamic = 'force-dynamic';

// GET single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) {
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }

        await connectToDatabase();

        const product = await ProductModel.findById(params.id)
            .populate({ path: 'category', select: 'name slug', model: CategoryModel })
            .populate({ path: 'media', select: 'path thumbnail_url title', model: MediaModel })
            .lean();

        if (!product) {
            return response({ success: false, statusCode: 404, message: "Product not found" });
        }

        return response({
            success: true,
            statusCode: 200,
            message: "Product retrieved successfully",
            data: product
        });

    } catch (error: any) {
        console.error('Error fetching product:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}

// PATCH restore soft-deleted product
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) {
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }

        await connectToDatabase();

        const existingProduct = await ProductModel.findById(params.id);
        if (!existingProduct) {
            return response({ success: false, statusCode: 404, message: "Product not found" });
        }

        // Restore by clearing deleted_At
        await ProductModel.findByIdAndUpdate(params.id, { deleted_At: null });

        return response({
            success: true,
            statusCode: 200,
            message: "Product restored successfully",
        });
    } catch (error: any) {
        console.error('Error restoring product:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}

// PUT update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) {
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }

        await connectToDatabase();

        const body = await req.json();
        const { name, description, category, mrp, sellingPrice, discount } = body;

        // Validate required fields
        if (!name || !description || !category || mrp === undefined || sellingPrice === undefined || discount === undefined) {
            return response({
                success: false,
                statusCode: 400,
                message: "All fields are required"
            });
        }

        // Check if product exists
        const existingProduct = await ProductModel.findById(params.id);
        if (!existingProduct) {
            return response({ success: false, statusCode: 404, message: "Product not found" });
        }

        // Generate unique slug
        let slug = slugify(name, { lower: true, strict: true });
        const originalSlug = slug;
        let counter = 1;
        
        while (true) {
            const existingSlug = await ProductModel.findOne({ 
                slug, 
                _id: { $ne: params.id },
                deleted_At: null 
            });
            if (!existingSlug) break;
            slug = `${originalSlug}-${counter}`;
            counter++;
        }

        // Update product
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            params.id,
            {
                name: name.trim(),
                slug,
                description: description.trim(),
                category,
                mrp: parseFloat(mrp),
                sellingPrice: parseFloat(sellingPrice),
                discount: parseFloat(discount),
            },
            { new: true, runValidators: true }
        ).populate({ path: 'category', select: 'name slug', model: CategoryModel })
         .populate({ path: 'media', select: 'path thumbnail_url title', model: MediaModel });

        return response({
            success: true,
            statusCode: 200,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error: any) {
        console.error('Error updating product:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}

// DELETE product (soft delete)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) {
            return response({ success: false, statusCode: 401, message: "Unauthorized" });
        }

        await connectToDatabase();

        const { searchParams } = new URL(req.url);
        const hard = (searchParams.get('hard') || '') === '1' || (searchParams.get('hard') || '') === 'true';

        // Check if product exists
        const existingProduct = await ProductModel.findById(params.id);
        if (!existingProduct) {
            return response({ success: false, statusCode: 404, message: "Product not found" });
        }

        if (hard) {
            await ProductModel.findByIdAndDelete(params.id);
        } else {
            // Soft delete
            await ProductModel.findByIdAndUpdate(params.id, { deleted_At: new Date() });
        }

        return response({
            success: true,
            statusCode: 200,
            message: hard ? "Product permanently deleted" : "Product deleted successfully"
        });

    } catch (error: any) {
        console.error('Error deleting product:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}

