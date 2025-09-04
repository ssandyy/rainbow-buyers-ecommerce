import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'

const MediaModal = ({ open, setOpen, selectedMedia, setSelectedMedia, isMultiple }: any) => {
    const handleSeleted = () => { }
    const handleClearAll = () => { }
    const handleClose = () => setOpen(false)

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent
                onInteractOutside={(e) => e.preventDefault()}
                className="sm:max-w-[80%] h-[80%] p- py-10"
            >
                <div className="h-[90vh] bg-white p-3 rounded shadow">
                    <DialogHeader className="h-8">
                        <DialogTitle>Media</DialogTitle>
                        {/* ✅ Keep description only if you want text */}
                        <DialogDescription className="text-sm text-muted-foreground">
                            Select one or more media files
                        </DialogDescription>
                    </DialogHeader>

                    {/* Middle area */}
                    <div className="flex-1 overflow-y-auto">{/* your media grid here */}</div>

                    {/* Footer area */}
                    <div className="h-10 pt-3 border-t flex justify-between">
                        <div className="flex space-x-2">
                            <Button type="button" variant="destructive" onClick={handleClearAll}>
                                Clear All
                            </Button>
                        </div>
                        <div>
                            <Button type="button" variant="secondary" onClick={handleSeleted}>
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
