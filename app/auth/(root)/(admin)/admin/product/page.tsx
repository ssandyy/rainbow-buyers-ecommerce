"use client"

import DataTableWrapper from "@/components/application/Admin/DataTableWrapper"
import BreadCrumb from "@/components/application/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_PRODUCT_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"
import { useEffect, useMemo, useState } from "react"
import slugify from "slugify"
import Link from "next/link"
import { Plus } from "lucide-react"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT_SHOW, label: "Products" },
]

type ApiList<T> = { data: T[]; meta?: { totalRowCount?: number } }

interface Product {
    _id: string
    name: string
    slug: string
    description: string
    category: {
        _id: string
        name: string
        slug: string
    }
    categoryId: string
    categoryName: string
    mrp: number
    sellingPrice: number
    discount: number
    media: Array<{
        _id: string
        path: string
        thumbnail_url: string
        title: string
    }>
    createdAt: string
    updatedAt: string
}

interface Category {
    _id: string
    name: string
    slug: string
}

const ProductPage = () => {
    const [showTrash, setShowTrash] = useState(false);

    const [categories, setCategories] = useState<Category[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // Inline edit form state
    const [editingItem, setEditingItem] = useState<Product | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editCategoryId, setEditCategoryId] = useState<string>("");
    const [editMrp, setEditMrp] = useState("");
    const [editSellingPrice, setEditSellingPrice] = useState("");
    const [editDiscount, setEditDiscount] = useState("");
    const [savingEdit, setSavingEdit] = useState(false);

    const categoryOptions = useMemo(() => [{ _id: "", name: "Select Category" } as any, ...categories.map(c => ({ _id: (c as any)._id, name: (c as any).name }))], [categories]);

    useEffect(() => {
        // Load categories (active only)
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const resp = await fetch(`/api/category?start=0&size=1000`);
                const json = await resp.json();
                const payload: any = json?.data ?? json;
                const rows: Category[] = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                setCategories(rows);
            } catch (e) {
                // ignore
            } finally {
                setLoadingCategories(false);
            }
        };
        loadCategories();
    }, []);


    const startEdit = (item: Product) => {
        setEditingItem(item);
        setEditName(item.name);
        setEditDescription(item.description);
        setEditCategoryId(item.categoryId || '');
        setEditMrp(item.mrp.toString());
        setEditSellingPrice(item.sellingPrice.toString());
        setEditDiscount(item.discount.toString());
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditName('');
        setEditDescription('');
        setEditCategoryId('');
        setEditMrp('');
        setEditSellingPrice('');
        setEditDiscount('');
    };

    const saveEdit = async () => {
        if (!editingItem || !editName.trim() || !editDescription.trim() || !editCategoryId || !editMrp || !editSellingPrice || !editDiscount) {
            alert('Please fill all required fields');
            return;
        }

        try {
            setSavingEdit(true);
            const slug = slugify(editName, { lower: true, strict: true });
            
            const response = await fetch(`/api/product/${editingItem._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: editName.trim(),
                    description: editDescription.trim(),
                    category: editCategoryId,
                    mrp: parseFloat(editMrp),
                    sellingPrice: parseFloat(editSellingPrice),
                    discount: parseFloat(editDiscount),
                }),
            });

            if (response.ok) {
                cancelEdit();
                // Refresh the table
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update product');
            }
        } catch (error) {
            alert('Error updating product');
        } finally {
            setSavingEdit(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <BreadCrumb breadCrumbData={breadCrumbData} />
            
            <Card className="flex-1 min-h-0 flex flex-col">
                <CardHeader className="flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <CardTitle>Products</CardTitle>
                        <div className="flex gap-2">
                            <Button
                                variant={showTrash ? "default" : "outline"}
                                onClick={() => setShowTrash(!showTrash)}
                                size="sm"
                            >
                                {showTrash ? "Hide Trash" : "Show Trash"}
                            </Button>
                <Link href="/auth/admin/product/add">
                                <Button size="sm" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
                        </div>
            </div>


                    {/* Inline Edit Form */}
                    {editingItem && (
                        <div className="mt-4 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20">
                            <h3 className="text-lg font-medium mb-3">Edit Product: {editingItem.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="editName">Name *</Label>
                                    <Input
                                        id="editName"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="Product name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editDescription">Description *</Label>
                                    <Input
                                        id="editDescription"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Product description"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="editCategory">Category *</Label>
                                    <select
                                        id="editCategory"
                                        value={editCategoryId}
                                        onChange={(e) => setEditCategoryId(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        disabled={loadingCategories}
                                    >
                                        {categoryOptions.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    </div>
                                <div>
                                    <Label htmlFor="editMrp">MRP *</Label>
                                    <Input
                                        id="editMrp"
                                        type="number"
                                        value={editMrp}
                                        onChange={(e) => setEditMrp(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                    </div>
                                <div>
                                    <Label htmlFor="editSellingPrice">Selling Price *</Label>
                                    <Input
                                        id="editSellingPrice"
                                        type="number"
                                        value={editSellingPrice}
                                        onChange={(e) => setEditSellingPrice(e.target.value)}
                                        placeholder="0.00"
                                        step="0.01"
                                    />
                                    </div>
                                <div>
                                    <Label htmlFor="editDiscount">Discount % *</Label>
                                    <Input
                                        id="editDiscount"
                                        type="number"
                                        value={editDiscount}
                                        onChange={(e) => setEditDiscount(e.target.value)}
                                        placeholder="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>
                                <div className="flex gap-2 mt-4">
                                <Button onClick={saveEdit} disabled={savingEdit}>
                                    {savingEdit ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button variant="outline" onClick={cancelEdit}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                    <div className="h-full overflow-auto">
                        <div className="w-full">
                        <DataTableWrapper<Product>
                            queryKey="product"
                            fetchUrl="/api/product"
                            trashview={showTrash}
                            collumnConfig={[
                                {
                                    accessorKey: "thumbnail",
                                    header: "Image",
                                    Cell: ({ row }) => {
                                        const product = row.original;
                                        return (
                                            <div className="w-16 h-16 flex items-center justify-center">
                                                {product.media && product.media.length > 0 ? (
                                                    <img
                                                        src={product.media[0].thumbnail_url || product.media[0].path}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover rounded-md border"
                                                        onError={(e) => {
                                                            e.currentTarget.src = '/images/img-placeholder.webp';
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-200 rounded-md border flex items-center justify-center">
                                                        <span className="text-xs text-gray-500">No Image</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    },
                                    size: 80,
                                },
                                { accessorKey: "name", header: "Name", size: 180 },
                                { accessorKey: "slug", header: "Slug", size: 200 },
                                { accessorKey: "categoryName", header: "Category", size: 150 },
                                { accessorKey: "mrp", header: "MRP", size: 100, Cell: ({ cell }) => `₹${cell.getValue()}` },
                                { accessorKey: "sellingPrice", header: "Selling Price", size: 120, Cell: ({ cell }) => `₹${cell.getValue()}` },
                                { accessorKey: "discount", header: "Discount %", size: 100, Cell: ({ cell }) => `${cell.getValue()}%` },
                                {
                                    accessorKey: "createdAt",
                                    header: "Created At",
                                    Cell: ({ cell }) => {
                                        const date = new Date(cell.getValue() as string);
                                        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                                    },
                                    size: 150,
                                },
                                {
                                    accessorKey: "updatedAt",
                                    header: "Updated At",
                                    Cell: ({ cell }) => {
                                        const date = new Date(cell.getValue() as string);
                                        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
                                    },
                                    size: 150,
                                },
                                showTrash
                                    ? {
                                        accessorKey: "deleted_At",
                                        header: "Deleted At",
                                        Cell: ({ row, cell }) => {
                                            const date = new Date(cell.getValue() as string);
                                            return (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs">{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => {
                                                            if (confirm('Restore this product?')) {
                                                                fetch(`/api/product/${row.original._id}`, { method: 'PATCH' })
                                                                    .then(() => window.location.reload());
                                                            }
                                                        }}
                                                    >
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            if (confirm('Permanently delete this product? This cannot be undone.')) {
                                                                fetch(`/api/product/${row.original._id}?hard=1`, { method: 'DELETE' })
                                                                    .then(() => window.location.reload());
                                                            }
                                                        }}
                                                    >
                                                        Delete Forever
                                                    </Button>
                                                </div>
                                            );
                                        },
                                        size: 250,
                                    }
                                    : {
                                        accessorKey: "actions",
                                        header: "Actions",
                                        Cell: ({ row }) => (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => startEdit(row.original)}
                                                >
                                            Edit
                                        </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (confirm('Move this product to trash?')) {
                                                            fetch(`/api/product/${row.original._id}`, { method: 'DELETE' })
                                                                .then(() => window.location.reload());
                                                        }
                                                    }}
                                                >
                                        Delete
                                    </Button>
                                </div>
                                        ),
                                        size: 150,
                                    }
                            ]}
                            topActions={({ selectedRows, clearSelection, refetch }) => (
                                showTrash ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={!selectedRows.length}
                                            onClick={async () => {
                                                if (!selectedRows.length) return;
                                                if (!confirm(`Restore ${selectedRows.length} product(s)?`)) return;
                                                await Promise.all(selectedRows.map((row: any) => fetch(`/api/product/${row._id}`, { method: 'PATCH' })));
                                                clearSelection();
                                                refetch();
                                            }}
                                        >
                                            Restore Selected
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={!selectedRows.length}
                                            onClick={async () => {
                                                if (!selectedRows.length) return;
                                                if (!confirm(`Permanently delete ${selectedRows.length} product(s)? This cannot be undone.`)) return;
                                                await Promise.all(selectedRows.map((row: any) => fetch(`/api/product/${row._id}?hard=1`, { method: 'DELETE' })));
                                                clearSelection();
                                                refetch();
                                            }}
                                        >
                                            Delete Forever
                                        </Button>
                                    </div>
                                ) : null
                            )}
                            topActions={({ selectedRows, clearSelection, refetch }) => (
                                showTrash ? (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            disabled={!selectedRows.length}
                                            onClick={async () => {
                                                if (!selectedRows.length) return;
                                                if (!confirm(`Restore ${selectedRows.length} product(s)?`)) return;
                                                await Promise.all(selectedRows.map((row: any) => fetch(`/api/product/${row._id}`, { method: 'PATCH' })));
                                                clearSelection();
                                                refetch();
                                            }}
                                        >
                                            Restore Selected
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            disabled={!selectedRows.length}
                                            onClick={async () => {
                                                if (!selectedRows.length) return;
                                                if (!confirm(`Permanently delete ${selectedRows.length} product(s)? This cannot be undone.`)) return;
                                                await Promise.all(selectedRows.map((row: any) => fetch(`/api/product/${row._id}?hard=1`, { method: 'DELETE' })));
                                                clearSelection();
                                                refetch();
                                            }}
                                        >
                                            Delete Forever
                                        </Button>
                                    </div>
                                ) : null
                            )}
                        />
                </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductPage