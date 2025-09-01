'use client'
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"
import { Logs, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"
import { useSelector } from "react-redux"

const AdminTopbar = () => {

    const { theme, setTheme } = useTheme()
    const { toggleSidebar } = useSidebar()
    const auth = useSelector((store: any) => store.authStore.auth)

    return (
        <div className="flex items-center justify-between h-16 w-full bg-gray-300 dark:bg-gray-800 dark:text-white border-b px-6 shrink-0">
            <div className="font-semibold text-gray-800 dark:text-white">
                <h1>Admin </h1>
            </div>

            <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search"
                        className="border border-gray-300 p-2 rounded-md bg-purple-300 dark:bg-gray-800 dark:text-white"
                    />
                </div>
                <div className="cursor-pointer">
                    <SunMoon
                        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                        className="w-6 h-6 text-gray-800 dark:text-yellow-400"
                    />


                </div>

                <div>
                    <span className="text-sm text-gray-600 dark:text-white ">Welcome, {auth?.name}</span>
                </div>


                {/* Menu button → visible only on mobile */}
                <div className="md:hidden bg-amber-500 rounded-md">
                    <Button onClick={toggleSidebar} variant="ghost" size="icon">
                        <Logs />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default AdminTopbar
