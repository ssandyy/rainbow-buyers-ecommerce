"use client"

import { Button } from "@/components/ui/button"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"
import { WEBSITE_HOME, WEBSITE_LOGIN } from "@/routes/WebsiteRoutes"
import { logout } from "@/store/reducer/authReducer"
import { useAuth } from "@/hooks/useAuth"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"

const Navbar = () => {
    const router = useRouter()
    const dispatch = useDispatch()
    const auth = useSelector((state: any) => state.authStore.auth)
    const { validateAuth, isAuthenticated } = useAuth()

    // Validate auth state on component mount
    useEffect(() => {
        validateAuth()
    }, [validateAuth])

    const onLogout = async () => {
        try {
            await axios.post("/api/authentication/logout")
        } catch { }
        // Clear both token cookies
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        dispatch(logout())
        router.push(WEBSITE_LOGIN)
    }




    return (
        <header className="border-b bg-gray-100 dark:bg-gray-800">
            <div className="container mx-auto flex items-center justify-between py-3 px-6 dark:text-white">
                <Link href="/" className="font-semibold">Rainbow Buyers</Link>
                <nav className="flex items-center gap-3">
                    <Link href={WEBSITE_HOME} className="text-sm">Home</Link>
                    {auth?.role === "admin" && (
                        <Link href={ADMIN_DASHBOARD} className="text-sm">Admin</Link>
                    )}
                    {isAuthenticated && auth ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm">Welcome, {auth?.name}</span>
                            <Button size="sm" onClick={onLogout}>Logout</Button>
                        </div>
                    ) : (
                        <Link href={WEBSITE_LOGIN} className="text-sm">Login</Link>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar


