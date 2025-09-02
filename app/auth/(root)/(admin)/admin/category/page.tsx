"use client"

import DataTableWrapper from "@/components/application/Admin/DataTableWrapper"
import BreadCrumb from "@/components/application/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"
import { useEffect, useMemo, useState } from "react"
import slugify from "slugify"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
]


type Category = { _id: string; name: string; slug: string; parentId?: string | { _id: string; name: string } | null; parentName?: string; createdAt: string; updatedAt: string; deleted_At?: string | null }

type ApiList<T> = { data: T[]; meta?: { totalRowCount?: number } }

const CategoryPage = () => {
    const [showTrash, setShowTrash] = useState(false);

    // Inline add form state
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState("");
    const [newParentId, setNewParentId] = useState<string>("");
    const [parents, setParents] = useState<Category[]>([]);
    const [loadingParents, setLoadingParents] = useState(false);

    // Inline edit form state
    const [editingItem, setEditingItem] = useState<Category | null>(null);
    const [editName, setEditName] = useState("");
    const [editParentId, setEditParentId] = useState<string>("");
    const [savingEdit, setSavingEdit] = useState(false);

    const parentOptions = useMemo(() => [{ _id: "", name: "None" } as any, ...parents.map(p => ({ _id: (p as any)._id, name: (p as any).name }))], [parents]);

    useEffect(() => {
        // Load parent categories (active only)
        const loadParents = async () => {
            try {
                setLoadingParents(true);
                const resp = await fetch(`/api/category?start=0&size=1000`);
                const json = await resp.json();
                const payload: any = json?.data ?? json;
                const rows: Category[] = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                setParents(rows);
            } catch (e) {
                // ignore
            } finally {
                setLoadingParents(false);
            }
        };
        loadParents();
    }, []);

    const submitNew = async () => {
        if (!newName.trim()) return;
        try {
            setCreating(true);
            const body: any = { name: newName.trim() };
            if (newParentId) body.parentId = newParentId;
            await fetch(`/api/category/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            setNewName("");
            setNewParentId("");
            // Refresh list and parents
            (document.getElementById('admin-table-refresh') as HTMLButtonElement)?.click();
            try {
                const resp = await fetch(`/api/category?start=0&size=1000`);
                const json = await resp.json();
                const payload: any = json?.data ?? json;
                const rows: Category[] = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                setParents(rows);
            } catch { }
        } finally {
            setCreating(false);
        }
    };

    const openEdit = (item: Category) => {
        setEditingItem(item);
        setEditName(item.name);
        // parentId is normalized by API to string|null
        const pid = typeof item.parentId === 'string' ? item.parentId : (item.parentId && typeof item.parentId === 'object' ? (item.parentId as any)._id : "");
        setEditParentId(pid || "");
    }

    const submitEdit = async () => {
        if (!editingItem) return;
        if (!editName.trim()) return;
        try {
            setSavingEdit(true);
            const body: any = { name: editName.trim(), parentId: editParentId || null };
            await fetch(`/api/category/${editingItem._id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            setEditingItem(null);
            // refresh
            (document.getElementById('admin-table-refresh') as HTMLButtonElement)?.click();
            // reload parents (in case name changed)
            try {
                const resp = await fetch(`/api/category?start=0&size=1000`);
                const json = await resp.json();
                const payload: any = json?.data ?? json;
                const rows: Category[] = Array.isArray(payload?.data) ? payload.data : (Array.isArray(payload) ? payload : []);
                setParents(rows);
            } catch { }
        } finally {
            setSavingEdit(false);
        }
    }

    const cancelEdit = () => {
        setEditingItem(null);
        setEditName("");
        setEditParentId("");
    }

    return (
        <div className="h-full min-h-0 flex flex-col">
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <Card className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <CardHeader className="flex flex-col gap-4 sticky top-0 z-10 bg-background">
                    <div className="flex flex-row items-center justify-between w-full">
                        <CardTitle>Category</CardTitle>
                        <div className="flex gap-2">
                            <Button variant={showTrash ? "secondary" : "default"} onClick={() => setShowTrash(false)}>Active</Button>
                            <Button variant={showTrash ? "default" : "secondary"} onClick={() => setShowTrash(true)}>Trash</Button>
                        </div>
                    </div>

                    {/* Inline Add Category */}
                    {!showTrash && !editingItem && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="cat-name">Category Name</Label>
                                <Input id="cat-name" placeholder="e.g. Smartphones" value={newName} onChange={(e) => setNewName(e.target.value)} />
                                {newName.trim() && (
                                    <span className="text-xs text-muted-foreground">Slug: {slugify(newName.trim(), { lower: true, strict: true, trim: true })}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="cat-parent">Parent</Label>
                                <select id="cat-parent" className="h-10 rounded-md border px-3 text-sm" value={newParentId} onChange={(e) => setNewParentId(e.target.value)} disabled={loadingParents}>
                                    {parentOptions.map(opt => (
                                        <option key={opt._id} value={opt._id}>{opt.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={submitNew} disabled={creating || !newName.trim()}>{creating ? 'Adding…' : 'Add Category'}</Button>
                                <Button variant="secondary" onClick={() => { setNewName(""); setNewParentId(""); }}>Reset</Button>
                            </div>
                        </div>
                    )}

                    {/* Inline Edit Category */}
                    {!showTrash && editingItem && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end border rounded-md p-3 mb-3">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="edit-name">Edit Name</Label>
                                <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                                {editName.trim() && (
                                    <span className="text-xs text-muted-foreground">New slug: {slugify(editName.trim(), { lower: true, strict: true, trim: true })}</span>
                                )}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="edit-parent">Parent</Label>
                                <select id="edit-parent" className="h-10 rounded-md border px-3 text-sm" value={editParentId} onChange={(e) => setEditParentId(e.target.value)} disabled={loadingParents}>
                                    {parentOptions.map(opt => (
                                        <option key={opt._id} value={opt._id}>{opt.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={submitEdit} disabled={savingEdit || !editName.trim()}>{savingEdit ? 'Saving…' : 'Save'}</Button>
                                <Button variant="secondary" onClick={cancelEdit}>Cancel</Button>
                            </div>
                        </div>
                    )}
                </CardHeader>
                <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
                    <div className="h-full overflow-auto">
                        <div className="w-full">
                        <DataTableWrapper<Category>
                            queryKey="category"
                            fetchUrl="/api/category"
                            trashview={showTrash}
                            collumnConfig={[
                                { accessorKey: "name", header: "Name", size: 200 },
                                { accessorKey: "slug", header: "Slug", size: 200 },
                                { accessorKey: "parentName", header: "Parent", size: 200 },
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
                                        header: "Actions",
                                        id: "actions",
                                        Cell: ({ row }) => {
                                            const item = row.original as Category;
                                            const handleRestore = async () => {
                                                await fetch(`/api/category/${item._id}?restore=1`, {
                                                    method: "POST",
                                                });
                                                (
                                                    document.getElementById(
                                                        "admin-table-refresh"
                                                    ) as HTMLButtonElement
                                                )?.click();
                                            };
                                            const handleHardDelete = async () => {
                                                if (!confirm("Permanently delete this category?")) return;
                                                await fetch(`/api/category/${item._id}?hard=1`, {
                                                    method: "DELETE",
                                                });
                                                (
                                                    document.getElementById(
                                                        "admin-table-refresh"
                                                    ) as HTMLButtonElement
                                                )?.click();
                                            };
                                            return (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={handleRestore}
                                                    >
                                                        Restore
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={handleHardDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            );
                                        },
                                        size: 180,
                                    }
                                    : {
                                        header: "Actions",
                                        id: "actions",
                                        Cell: ({ row }) => {
                                            const item = row.original as Category;
                                            const handleDelete = async () => {
                                                await fetch(`/api/category/${item._id}`, {
                                                    method: "DELETE",
                                                });
                                                (
                                                    document.getElementById(
                                                        "admin-table-refresh"
                                                    ) as HTMLButtonElement
                                                )?.click();
                                            };
                                            const handleEditClick = () => openEdit(item);
                                            return (
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="secondary"
                                                        onClick={handleEditClick}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={handleDelete}
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            );
                                        },
                                        size: 180,
                                    },
                            ]}
                        />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default CategoryPage