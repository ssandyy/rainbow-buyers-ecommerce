"use client"
import AdminFooter from "@/components/application/Admin/AdminFooter"
import AdminSidebar from "@/components/application/Admin/AdminSidebar"
import AdminTopbar from "@/components/application/Admin/Topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Sidebar - Full Height */}
                <AdminSidebar />

                {/* Main content area with topbar */}
                <div className="flex flex-col flex-1">
                    {/* Topbar - Only spans content area */}
                    <AdminTopbar />

                    {/* Content */}
                    <main className="flex-1 p-6">
                        {children}
                    </main>

                    {/* Footer */}
                    <AdminFooter />
                </div>
            </div>
        </SidebarProvider>
    )
}

export default AdminLayout