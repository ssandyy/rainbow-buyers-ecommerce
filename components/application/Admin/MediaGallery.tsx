"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { showToast } from "@/lib/showToast"
import { Edit2, Trash2, Save, X, Copy, Eye, Download } from "lucide-react"

type MediaItem = {
    _id: string
    asset_id: string
    public_id: string
    path: string
    thumbnail_url: string
    title?: string
    alt?: string
    deleted?: string | null
}

const MediaGallery = () => {
    const [items, setItems] = useState<MediaItem[]>([])
    const [selected, setSelected] = useState<Set<string>>(new Set())
    const [loading, setLoading] = useState(false)
    const [includeDeleted, setIncludeDeleted] = useState(false)
    const [q, setQ] = useState("")
    const [page, setPage] = useState(1)
    const [limit] = useState(24)
    const [total, setTotal] = useState(0)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editForm, setEditForm] = useState({ title: "", alt: "" })

    const pages = Math.max(1, Math.ceil(total / limit))

    const fetchItems = async () => {
        setLoading(true)
        try {
            const { data } = await axios.get(`/api/media`, { params: { includeDeleted, q, page, limit } })
            if (data?.success) {
                setItems(data.data || [])
                setTotal(data.total || 0)
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchItems()
        const handler = () => fetchItems()
        document.addEventListener("media:updated", handler)
        return () => document.removeEventListener("media:updated", handler)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [includeDeleted, q, page])

    const allSelected = useMemo(() => selected.size > 0 && selected.size === items.length, [selected, items])

    const toggleSelectAll = () => {
        if (allSelected) setSelected(new Set())
        else setSelected(new Set(items.map((i) => i._id)))
    }

    const selectNone = () => setSelected(new Set())

    const invertSelection = () => {
        const next = new Set<string>()
        for (const item of items) {
            if (!selected.has(item._id)) next.add(item._id)
        }
        setSelected(next)
    }

    const toggleOne = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const softDelete = async () => {
        if (selected.size === 0) return
        try {
            await axios.patch("/api/media", { ids: Array.from(selected), action: "soft-delete" })
            setSelected(new Set())
            fetchItems()
            showToast({ type: "success", message: `${selected.size} item(s) moved to trash` })
        } catch (error) {
            showToast({ type: "error", message: "Failed to delete items" })
        }
    }

    const restore = async () => {
        if (selected.size === 0) return
        try {
            await axios.patch("/api/media", { ids: Array.from(selected), action: "restore" })
            setSelected(new Set())
            fetchItems()
            showToast({ type: "success", message: `${selected.size} item(s) restored` })
        } catch (error) {
            showToast({ type: "error", message: "Failed to restore items" })
        }
    }

    const permanentDelete = async () => {
        if (selected.size === 0) return
        if (!confirm(`Are you sure you want to permanently delete ${selected.size} item(s)? This action cannot be undone.`)) return
        
        try {
            await axios.delete("/api/media", { data: { ids: Array.from(selected) } })
            setSelected(new Set())
            fetchItems()
            showToast({ type: "success", message: `${selected.size} item(s) permanently deleted` })
        } catch (error) {
            showToast({ type: "error", message: "Failed to delete items" })
        }
    }

    const startEditing = (item: MediaItem) => {
        setEditingId(item._id)
        setEditForm({
            title: item.title || "",
            alt: item.alt || ""
        })
    }

    const cancelEditing = () => {
        setEditingId(null)
        setEditForm({ title: "", alt: "" })
    }

    const saveEdit = async (item: MediaItem) => {
        try {
            const response = await axios.patch(`/api/media/${item._id}`, {
                title: editForm.title,
                alt: editForm.alt
            })
            
            if (response.data.success) {
                setItems(prev => prev.map(i => 
                    i._id === item._id 
                        ? { ...i, title: editForm.title, alt: editForm.alt }
                        : i
                ))
                setEditingId(null)
                setEditForm({ title: "", alt: "" })
                showToast({ type: "success", message: "Media updated successfully" })
            }
        } catch (error) {
            showToast({ type: "error", message: "Failed to update media" })
        }
    }

    const [preview, setPreview] = useState<MediaItem | null>(null)

    const copyUrl = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url)
            showToast({ type: "success", message: "URL copied to clipboard" })
        } catch {
            showToast({ type: "error", message: "Failed to copy URL" })
        }
    }

    const downloadImage = async (url: string, filename: string) => {
        try {
            const response = await fetch(url)
            const blob = await response.blob()
            const downloadUrl = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = downloadUrl
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(downloadUrl)
            showToast({ type: "success", message: "Download started" })
        } catch (error) {
            showToast({ type: "error", message: "Failed to download image" })
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                    <span>Select All</span>
                    <span className="ml-3 text-sm text-muted-foreground">{selected.size} selected</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={selectNone} disabled={selected.size === 0}>Select None</Button>
                    <Button variant="secondary" onClick={invertSelection} disabled={items.length === 0}>Invert</Button>
                    <Button variant="destructive" onClick={softDelete} disabled={selected.size === 0}>Move to Trash</Button>
                    <Button onClick={restore} disabled={selected.size === 0}>Restore</Button>
                    <Button variant="destructive" onClick={permanentDelete} disabled={selected.size === 0}>Delete Permanently</Button>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <input
                    value={q}
                    onChange={(e) => { setPage(1); setQ(e.target.value) }}
                    placeholder="Search by title or public id"
                    className="border px-3 py-2 rounded w-64"
                />
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={includeDeleted} onChange={() => { setPage(1); setIncludeDeleted((v) => !v) }} />
                    <span>Show deleted</span>
                </label>
                <Button size="sm" onClick={fetchItems} disabled={loading}>{loading ? "Loading..." : "Refresh"}</Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {items.map((item) => {
                    const isChecked = selected.has(item._id)
                    const isEditing = editingId === item._id
                    
                    return (
                        <Card key={item._id} className={`relative overflow-hidden ${item.deleted ? "opacity-60" : ""}`}>
                            <div className="absolute left-2 top-2 z-10 flex items-center gap-1">
                                <input type="checkbox" checked={isChecked} onChange={() => toggleOne(item._id)} />
                                <Button size="sm" variant="secondary" onClick={() => setPreview(item)}>
                                    <Eye className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => startEditing(item)}>
                                    <Edit2 className="w-3 h-3" />
                                </Button>
                            </div>
                            
                            <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
                                <Button size="sm" variant="secondary" onClick={() => copyUrl(item.path)}>
                                    <Copy className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => downloadImage(item.path, item.title || item.public_id)}>
                                    <Download className="w-3 h-3" />
                                </Button>
                            </div>
                            
                            <Image src={item.thumbnail_url || item.path} alt={item.alt || item.title || "media"} width={300} height={200} className="w-full h-40 object-cover" />
                            
                            {isEditing ? (
                                <div className="p-2 space-y-2">
                                    <Input
                                        value={editForm.title}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Title"
                                        className="text-xs h-7"
                                    />
                                    <Input
                                        value={editForm.alt}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, alt: e.target.value }))}
                                        placeholder="Alt text"
                                        className="text-xs h-7"
                                    />
                                    <div className="flex gap-1">
                                        <Button size="sm" onClick={() => saveEdit(item)} className="flex-1 h-7">
                                            <Save className="w-3 h-3" />
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={cancelEditing} className="h-7">
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 text-xs truncate" title={item.title || item.public_id}>
                                    {item.title || item.public_id}
                                </div>
                            )}
                        </Card>
                    )
                })}
            </div>

            <div className="flex items-center justify-center gap-3">
                <Button size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
                <span className="text-sm">Page {page} of {pages}</span>
                <Button size="sm" disabled={page >= pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>Next</Button>
            </div>

            {preview && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setPreview(null)}>
                    <div className="bg-white p-4 rounded shadow max-w-[90vw] max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-2">
                            <div className="font-medium truncate max-w-[60vw]" title={preview.title || preview.public_id}>{preview.title || preview.public_id}</div>
                            <Button size="sm" variant="secondary" onClick={() => setPreview(null)}>Close</Button>
                        </div>
                        <div className="relative w-[80vw] max-w-[900px] h-[70vh]">
                            <Image src={preview.path} alt={preview.alt || preview.title || "media"} fill className="object-contain" />
                        </div>
                        <div className="mt-2 text-sm text-gray-600">
                            <p><strong>Public ID:</strong> {preview.public_id}</p>
                            <p><strong>Asset ID:</strong> {preview.asset_id}</p>
                            <p><strong>URL:</strong> <span className="break-all">{preview.path}</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default MediaGallery

