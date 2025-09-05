"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/hooks/useAuth"

interface AuthProviderProps {
    children: React.ReactNode
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const hasValidated = useRef(false)
    const { validateAuth } = useAuth()

    useEffect(() => {
        // Only validate once on app load, not on every re-render
        if (!hasValidated.current) {
            hasValidated.current = true
            // Validate authentication state on app initialization
            validateAuth()
        }
    }, [validateAuth])

    return <>{children}</>
}

export default AuthProvider
