"use client"

import { Loader2Icon, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ButtonLoadingProps {
    type?: "button" | "submit" | "reset"
    text: string
    loading?: boolean
    success?: boolean
    error?: boolean
    onClick?: () => void
    className?: string
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success" | "warning" | "info" | "admin" | "premium"
    size?: "default" | "sm" | "lg" | "xl" | "icon" | "icon-sm" | "icon-lg"
    disabled?: boolean
    showSuccessIcon?: boolean
    showErrorIcon?: boolean
    [key: string]: any
}

export function ButtonLoading({ 
    type, 
    text, 
    loading = false, 
    success = false,
    error = false,
    onClick, 
    className, 
    variant = "default",
    size = "default",
    disabled = false,
    showSuccessIcon = true,
    showErrorIcon = true,
    ...props 
}: ButtonLoadingProps) {
    const getIcon = () => {
        if (loading) {
            return <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
        }
        if (success && showSuccessIcon) {
            return <Check className="mr-2 h-4 w-4 text-green-600" />
        }
        if (error && showErrorIcon) {
            return <X className="mr-2 h-4 w-4 text-red-600" />
        }
        return null
    }

    const getVariant = () => {
        if (success) return "success"
        if (error) return "destructive"
        return variant
    }

    return (
        <Button 
            className={cn(
                className,
                success && "animate-pulse",
                error && "animate-bounce"
            )}
            variant={getVariant()}
            size={size}
            disabled={disabled || loading} 
            type={type} 
            onClick={loading ? undefined : onClick} 
            {...props}
        >
            {getIcon()}
            {text}
        </Button>
    )
}
