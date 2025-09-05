"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import axios from "axios"

interface MediaItem {
    _id: string
    path: string
    thumbnail_url: string
    title: string
    alt?: string
}

interface SelectedMediaPreviewProps {
    selectedMediaIds: string[]
    onRemove: (mediaId: string) => void
}

const SelectedMediaPreview = ({ selectedMediaIds, onRemove }: SelectedMediaPreviewProps) => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedMediaIds.length === 0) {
            setMediaItems([])
            return
        }

        const fetchMediaDetails = async () => {
            setLoading(true)
            try {
                const { data } = await axios.get(`/api/media?ids=${selectedMediaIds.join(',')}`)
                if (data.success) {
                    setMediaItems(data.data || [])
                }
            } catch (error) {
                console.error('Error fetching media details:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchMediaDetails()
    }, [selectedMediaIds])

    if (loading) {
        return (
            <div className="flex items-center justify-center p-4">
                <div className="text-sm text-gray-500">Loading previews...</div>
            </div>
        )
    }

    if (mediaItems.length === 0) {
        return null
    }

    return (
        <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Selected Images:</div>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {mediaItems.map((item) => (
                    <Card key={item._id} className="relative overflow-hidden group">
                        <div className="relative aspect-square">
                            <Image
                                src={item.path}
                                alt={item.alt || item.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 16vw, 100px"
                            />
                            <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-0.5 right-0.5 h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => onRemove(item._id)}
                            >
                                <X className="w-2.5 h-2.5" />
                            </Button>
                        </div>
                        <div className="p-0.5">
                            <div className="text-xs text-gray-600 truncate" title={item.title}>
                                {item.title}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default SelectedMediaPreview
