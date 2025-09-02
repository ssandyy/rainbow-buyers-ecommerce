import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import { categorySchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";
import slugify from "slugify";

async function generateUniqueSlug(baseName: string) {
    const base = slugify(baseName, { lower: true, strict: true, trim: true });
    let candidate = base;
    let suffix = 1;
    while (await CategoryModel.findOne({ slug: candidate })) {
        candidate = `${base}-${suffix++}`;
    }
    return candidate;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) return response({ success: false, statusCode: 401, message: "Unauthorized" });
        await connectToDatabase();

        const { id } = params;
        const payload = await req.json();
        const updateSchema = categorySchema.pick({ name: true, slug: true, parentId: true }).partial();
        const parsed = updateSchema.safeParse(payload);
        if (!parsed.success) {
            return response({ success: false, statusCode: 400, message: "Invalid data", data: parsed.error });
        }

        const existing = await CategoryModel.findById(id);
        if (!existing) return response({ success: false, statusCode: 404, message: "Category not found" });

        let updateDoc: any = { ...parsed.data };

        // If slug not provided but name changed or slug empty, generate
        if ((!updateDoc.slug || updateDoc.slug.trim() === "") && (updateDoc.name || !existing.slug)) {
            const baseForSlug = updateDoc.name || existing.name;
            updateDoc.slug = await generateUniqueSlug(baseForSlug);
        } else if (updateDoc.slug) {
            updateDoc.slug = slugify(updateDoc.slug, { lower: true, strict: true, trim: true });
            // ensure uniqueness if changed
            if (updateDoc.slug !== existing.slug && await CategoryModel.findOne({ slug: updateDoc.slug })) {
                updateDoc.slug = await generateUniqueSlug(updateDoc.slug);
            }
        }

        const updated = await CategoryModel.findByIdAndUpdate(id, updateDoc, { new: true });
        if (!updated) return response({ success: false, statusCode: 404, message: "Category not found" });

        return response({ success: true, statusCode: 200, message: "Category updated", data: updated });
    } catch (error) {
        console.error('Error updating category:', error);
        return response({ success: false, statusCode: 500, message: "Internal server error", data: null });
    }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) return response({ success: false, statusCode: 401, message: "Unauthorized" });
        await connectToDatabase();

        const url = new URL(req.url);
        const restore = url.searchParams.get('restore');
        if (restore === '1' || restore === 'true') {
            const restored = await CategoryModel.findByIdAndUpdate(params.id, { deleted_At: null }, { new: true });
            if (!restored) return response({ success: false, statusCode: 404, message: "Category not found" });
            return response({ success: true, statusCode: 200, message: "Category restored", data: restored });
        }

        return response({ success: false, statusCode: 400, message: "Invalid action" });
    } catch (error) {
        console.error('Error in category POST action:', error);
        return response({ success: false, statusCode: 500, message: "Internal server error", data: null });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) return response({ success: false, statusCode: 401, message: "Unauthorized" });
        await connectToDatabase();

        const url = new URL(req.url);
        const hard = url.searchParams.get('hard');
        if (hard === '1' || hard === 'true') {
            const removed = await CategoryModel.findByIdAndDelete(params.id);
            if (!removed) return response({ success: false, statusCode: 404, message: "Category not found" });
            return response({ success: true, statusCode: 200, message: "Category permanently deleted", data: removed });
        }

        const deleted = await CategoryModel.findByIdAndUpdate(params.id, { deleted_At: new Date() }, { new: true });
        if (!deleted) return response({ success: false, statusCode: 404, message: "Category not found" });

        return response({ success: true, statusCode: 200, message: "Category deleted", data: deleted });
    } catch (error) {
        console.error('Error deleting category:', error);
        return response({ success: false, statusCode: 500, message: "Internal server error", data: null });
    }
}
