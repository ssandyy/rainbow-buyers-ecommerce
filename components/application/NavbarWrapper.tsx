"use client"

import { usePathname } from "next/navigation"
import Navbar from "./Navbar"

const NavbarWrapper = () => {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith("/auth/admin") || pathname?.startsWith("/admin")
    if (isAdminRoute) return null
    return <Navbar />
}

export default NavbarWrapper


