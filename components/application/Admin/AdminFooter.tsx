'use client'
import { useSelector } from "react-redux"

const AdminFooter = () => {
    const currentYear = new Date().getFullYear()
    const auth = useSelector((store: any) => store.authStore.auth)

    return (
        <footer className="w-full h-12 bg-gray-100 border-t border-gray-300 dark:bg-gray-800">
            <div className="text-center p-3 text-gray-600 text-sm">
                &copy; {currentYear} Your Company. All rights reserved. | Logged in as: {auth?.name || 'Guest'}
            </div>
        </footer>
    )
}

export default AdminFooter