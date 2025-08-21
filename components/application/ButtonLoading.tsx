import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ButtonLoading({ type, text, loading, onClick, className, ...props }: any) {
    return (
        <Button className={className} disabled={loading} type={type} onClick={loading ? undefined : onClick} {...props}>
            {loading ? (
                <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                </>
            ) : (
                text   // {text} no need as its already in bracket
            )}
        </Button>
    )
}
