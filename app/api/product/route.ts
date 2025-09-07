import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import ProductModel from "@/models/Product.model";
import MediaModel from "@/models/Media.model";
import CategoryModel from "@/models/Category.model";
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        console.log('🚀 Product API called');
        const auth = await isAuthenticated('admin');
        if (!auth) {
            console.log('❌ Authentication failed');
            return response({ success: false, statusCode: 401, message: "Unauthorized" })
        }
        console.log('✅ Authentication successful');
        await connectToDatabase();
        console.log('✅ Database connected');

        // Parse params defensively
        let start = 0; let size = 10; let isTrash = false; let filters: any[] = []; let sorting: any[] = []; let globalFilter = '';
        try {
        const { searchParams } = new URL(req.url);
            console.log('📋 Search params:', searchParams.toString());
            const s = parseInt(searchParams.get('start') || '0');
            const p = parseInt(searchParams.get('size') || '10');
            start = Number.isFinite(s) && s >= 0 ? s : 0;
            size = Number.isFinite(p) && p > 0 ? p : 10;
            const trashParam = (searchParams.get('trash') || '').toString();
            isTrash = trashParam === '1' || trashParam === 'true';
            globalFilter = (searchParams.get('globalFilter') || '').toString();
            try { filters = JSON.parse(searchParams.get('filters') || '[]'); } catch { filters = []; }
            try { sorting = JSON.parse(searchParams.get('sorting') || '[]'); } catch { sorting = []; }
            console.log('📊 Parsed params - start:', start, 'size:', size, 'isTrash:', isTrash, 'globalFilter:', globalFilter);
        } catch (e) {
            console.error('Error parsing params:', e);
        }

        // Build query
        const query: any = { deleted_At: isTrash ? { $ne: null } : null };
        console.log('🔍 Initial query:', JSON.stringify(query, null, 2));

        if (globalFilter) {
            query.$or = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
                { description: { $regex: globalFilter, $options: 'i' } },
            ];
            console.log('🔍 Added global filter:', globalFilter);
        }

        if (Array.isArray(filters)) {
            console.log('🔍 Processing filters:', filters);
            for (const f of filters) {
                if (f?.id && f?.value !== undefined && f?.value !== null && f?.value !== '') {
                    if (f.id === 'category') {
                        query.category = f.value;
                        console.log('🔍 Added category filter:', f.value);
                    } else if (f.id === 'mrp') {
                        if (f.value.min !== undefined) query.mrp = { ...query.mrp, $gte: Number(f.value.min) };
                        if (f.value.max !== undefined) query.mrp = { ...query.mrp, $lte: Number(f.value.max) };
                        console.log('🔍 Added MRP filter:', f.value);
                    } else if (f.id === 'sellingPrice') {
                        if (f.value.min !== undefined) query.sellingPrice = { ...query.sellingPrice, $gte: Number(f.value.min) };
                        if (f.value.max !== undefined) query.sellingPrice = { ...query.sellingPrice, $lte: Number(f.value.max) };
                        console.log('🔍 Added selling price filter:', f.value);
                    } else if (f.id === 'discount') {
                        if (f.value.min !== undefined) query.discount = { ...query.discount, $gte: Number(f.value.min) };
                        if (f.value.max !== undefined) query.discount = { ...query.discount, $lte: Number(f.value.max) };
                        console.log('🔍 Added discount filter:', f.value);
                    }
                }
            }
        }

        // Build sort
        const sort: any = {};
        if (Array.isArray(sorting)) {
            console.log('🔍 Processing sorting:', sorting);
            for (const s of sorting) {
                if (s?.id && s?.desc !== undefined) {
                    sort[s.id] = s.desc ? -1 : 1;
                }
            }
        }
        if (Object.keys(sort).length === 0) {
            sort.createdAt = -1;
        }
        console.log('🔍 Final sort:', JSON.stringify(sort, null, 2));

        try {
            console.log('=== PRODUCT API DEBUG ===');
            console.log('🔍 Final query:', JSON.stringify(query, null, 2));
            console.log('🔍 Final sort:', JSON.stringify(sort, null, 2));
            console.log('📊 Start:', start, 'Size:', size);
            
            // First, let's try a simple query without populate to see if that works
            const simpleDocs = await ProductModel.find(query).lean();
            console.log('📊 Simple query found products:', simpleDocs.length);
            
            const [docs, total] = await Promise.all([
                ProductModel.find(query)
                    .sort(sort)
                    .skip(Math.max(0, start))
                    .limit(Math.max(1, size))
                    .populate({ path: 'category', select: 'name slug', model: CategoryModel })
                    .populate({ path: 'media', select: 'path thumbnail_url title', model: MediaModel })
                    .lean(),
                ProductModel.countDocuments(query)
            ]);

            console.log('📊 Found products:', docs.length);
            console.log('📊 Total products:', total);
            console.log('📋 Sample product:', docs[0]);

            // Normalize category fields for UI reliability
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

            // If trash view and no rows, include hint for redirect to active list
            if (isTrash && rows.length === 0) {
                (finalResponse.data as any).meta.emptyTrash = true;
            }

            console.log('📤 Final response:', JSON.stringify(finalResponse, null, 2));

            return response(finalResponse);
        } catch (dbErr: any) {
            console.error('❌ Database error:', dbErr);
            console.error('❌ Database error stack:', dbErr.stack);
            // Non-fatal fallback: return empty list with debug message
            return response({
                success: true,
                statusCode: 200,
                message: 'ok',
                data: { data: [], meta: { totalRowCount: 0, debug: dbErr?.message || 'DB error' } }
            });
        }

    } catch (e: any) {
        console.error('❌ General error:', e);
        console.error('❌ General error stack:', e.stack);
        // Final non-fatal fallback as well
        return response({
            success: true,
            statusCode: 200,
            message: 'ok',
            data: { data: [], meta: { totalRowCount: 0, debug: e?.message || 'Unknown' } }
        });
    }
}
