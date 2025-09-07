import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import MediaGallery from './MediaGallery'

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }: any) => {
    const [localSelectedMedia, setLocalSelectedMedia] = useState<string[]>([])

    // Sync local state with parent state when modal opens
    useEffect(() => {
        if (open) {
            setLocalSelectedMedia(selectedMedia || [])
        }
    }, [open, selectedMedia])

    const handleSelected = () => {
        // Update parent state with selected media
        setSelectedMedia(localSelectedMedia)
        setOpen(false)
    }

    const handleClearAll = () => {
        setLocalSelectedMedia([])
        setSelectedMedia([])
    }

    const handleClose = () => setOpen(false)

    const fetchMedia = async ({ page }: { page: number }) => {
        const { data: response } = await axios.get(`/api/media?page=${page}&limit=24&deleted=false`)
        return response
    }

    const { isPending, isError } = useInfiniteQuery({
        queryKey: ['MediaModal'],
        queryFn: async ({ pageParam }: { pageParam: number }) =>
            await fetchMedia({ page: pageParam }),
        initialPageParam: 0,
        placeholderData: keepPreviousData,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length
            return lastPage.hasMore ? nextPage : undefined
        }
    })





    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[90%] h-[90%] p-0"
            >
                <div className="h-full bg-white rounded shadow flex flex-col">
                    <DialogHeader className="p-6 pb-0">
                        <DialogTitle>Select Media</DialogTitle>
                        <DialogDescription className="text-sm text-muted-foreground">
                            {isMultiple ? "Select one or more media files" : "Select a media file"}
                        </DialogDescription>
                    </DialogHeader>

                    {/* Middle area with MediaGallery */}
                    <div className="flex-1 overflow-hidden p-6 pt-4">
                        <MediaGallery
                            selectedMedia={localSelectedMedia}
                            setSelectedMedia={setLocalSelectedMedia}
                            isMultiple={isMultiple}
                            isModal={true}
                        />
                    </div>

                    {/* Footer area */}
                    <div className="p-6 pt-2 border-t flex justify-between">
                        {/* <div className="flex space-x-2">
                            <Button type="button" variant="outline" onClick={handleClearAll}>
                                Clear All
                            </Button>
                        </div> */}
                        <div className="flex space-x-2">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSelected}>
                                Select
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MediaModal
