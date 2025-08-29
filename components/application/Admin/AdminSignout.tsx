'use client'
import { catchError } from "@/lib/apiHelperFunctions"
import { showToast } from "@/lib/showToast"
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes"
import { logout } from "@/store/reducer/authReducer"
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"

const AdminSignout = () => {
    const dispatch = useDispatch()
    const router = useRouter()

    const handleSignout = async () => {



        try {
            const { data: logoutResponse } = await axios.post("/api/authentication/logout")

            if (!logoutResponse.success) {
                throw new Error(logoutResponse.message || "Something went wrong")
            }
            dispatch(logout())  // this will delete data from state
            showToast({ type: "success", message: logoutResponse.message || "Signed out successfully" })
            router.push(WEBSITE_LOGIN)
        } catch (error: any) {
            const message = error?.response?.data?.message || error?.message || "Failed to sign out"
            catchError({ error })
            showToast({ type: "error", message })
        }
    }

    return (
        <DropdownMenuItem onClick={handleSignout} className="cursor-pointer ml-0.5">
            <span>Sign out</span>
        </DropdownMenuItem>
    )
}

export default AdminSignout