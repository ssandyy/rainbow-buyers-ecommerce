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

export async function POST(req: Request) {
    try {
        console.log('Category create API called');

        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('Authentication failed for category creation');
            return response({ success: false, statusCode: 401, message: "Unauthorized" })
        }
        console.log('Authentication successful for category creation');

        await connectToDatabase();
        console.log('Database connected for category creation');

        const payload = await req.json();
        console.log('Received payload:', payload);

        // Accept name and optional slug/parentId
        const catSchema = categorySchema.pick({
            name: true,
            slug: true,
            parentId: true,
        }).partial({ slug: true, parentId: true });

        const parsed = catSchema.safeParse(payload)
        if (!parsed.success) {
            console.log('Validation failed:', parsed.error);
            return response({ success: false, statusCode: 400, message: "Invalid data", data: parsed.error })
        }

        const { name } = parsed.data;
        let { slug, parentId } = parsed.data as { name: string; slug?: string; parentId?: string | null };

        if (!slug || slug.trim() === "") {
            slug = await generateUniqueSlug(name);
        } else {
            // normalize provided slug
            slug = slugify(slug, { lower: true, strict: true, trim: true });
            // ensure uniqueness
            if (await CategoryModel.findOne({ slug })) {
                slug = await generateUniqueSlug(slug);
            }
        }

        if (parentId) {
            const parentExists = await CategoryModel.findById(parentId).select('_id');
            if (!parentExists) {
                return response({ success: false, statusCode: 400, message: "Invalid parentId", data: null })
            }
        }

        const newCat = await CategoryModel.create({ name, slug, parentId: parentId ?? null });
        console.log('Category created successfully:', newCat);

        return response({ success: true, statusCode: 200, message: "Category created successfully", data: newCat })

    } catch (error) {
        console.error('Error creating category:', error);
        return response({
            success: false,
            statusCode: 500,
            message: "Internal server error",
            data: null
        });
    }
}