import { isAuthenticated, response } from "@/lib/apiHelperFunctions";
import connectToDatabase from "@/lib/dbconnection";
import CategoryModel from "@/models/Category.model";

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const auth = await isAuthenticated('admin');
        if (!auth) {
            return response({ success: false, statusCode: 401, message: "Unauthorized" })
        }
        await connectToDatabase();

        // Parse params defensively
        let start = 0; let size = 10; let isTrash = false; let filters: any[] = []; let sorting: any[] = []; let globalFilter = '';
        try {
            const { searchParams } = new URL(req.url);
            const s = parseInt(searchParams.get('start') || '0');
            const p = parseInt(searchParams.get('size') || '10');
            start = Number.isFinite(s) && s >= 0 ? s : 0;
            size = Number.isFinite(p) && p > 0 ? p : 10;
            const trashParam = (searchParams.get('trash') || '').toString();
            isTrash = trashParam === '1' || trashParam === 'true';
            globalFilter = (searchParams.get('globalFilter') || '').toString();
            try { filters = JSON.parse(searchParams.get('filters') || '[]'); } catch { filters = []; }
            try { sorting = JSON.parse(searchParams.get('sorting') || '[]'); } catch { sorting = []; }
        } catch {}

        // Build query
        const query: any = { deleted_At: isTrash ? { $ne: null } : null };

        if (globalFilter) {
            query.$or = [
                { name: { $regex: globalFilter, $options: 'i' } },
                { slug: { $regex: globalFilter, $options: 'i' } },
            ];
        }

        if (Array.isArray(filters)) {
            for (const f of filters) {
                if (!f || !f.id) continue;
                const value = f.value;
                if (value === undefined || value === null || `${value}` === '') continue;
                if (f.id === 'name' || f.id === 'slug') {
                    query[f.id] = { $regex: value, $options: 'i' };
                } else if (f.id === 'parentId') {
                    query[f.id] = value;
                } else {
                    query[f.id] = value;
                }
            }
        }

        // Sort
        let sort: any = { createdAt: -1 };
        if (Array.isArray(sorting) && sorting.length > 0) {
            sort = {};
            for (const s of sorting) {
                if (s && s.id) sort[s.id] = s.desc ? -1 : 1;
            }
            if (Object.keys(sort).length === 0) sort = { createdAt: -1 };
        }

        try {
            const [docs, total] = await Promise.all([
                CategoryModel.find(query)
                    .sort(sort)
                    .skip(Math.max(0, start))
                    .limit(Math.max(1, size))
                    .populate('parentId', 'name')
                    .lean(),
                CategoryModel.countDocuments(query)
            ]);

            // Normalize parent fields for UI reliability
            const rows = docs.map((d: any) => {
                const hasParentObj = d.parentId && typeof d.parentId === 'object' && 'name' in d.parentId;
                const parentName = hasParentObj ? (d.parentId as any).name : '-';
                const parentId = hasParentObj ? String((d.parentId as any)._id) : (d.parentId ? String(d.parentId) : null);
                return { ...d, parentId, parentName };
            });

            return response({
                success: true,
                statusCode: 200,
                message: 'ok',
                data: { data: rows, meta: { totalRowCount: total } }
            });
        } catch (dbErr: any) {
            // Non-fatal fallback: return empty list with debug message
            return response({
                success: true,
                statusCode: 200,
                message: 'ok',
                data: { data: [], meta: { totalRowCount: 0, debug: dbErr?.message || 'DB error' } }
            });
        }
    } catch (e: any) {
        // Final non-fatal fallback as well
        return response({
            success: true,
            statusCode: 200,
            message: 'ok',
            data: { data: [], meta: { totalRowCount: 0, debug: e?.message || 'Unknown' } }
        });
    }
}
