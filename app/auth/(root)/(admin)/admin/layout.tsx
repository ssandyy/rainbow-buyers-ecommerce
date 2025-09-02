"use client"
import AdminFooter from "@/components/application/Admin/AdminFooter"
import AdminSidebar from "@/components/application/Admin/AdminSidebar"
import ThemeSwitcher from "@/components/application/Admin/ThemeSwitcher"
import AdminTopbar from "@/components/application/Admin/Topbar"
import { SidebarProvider } from "@/components/ui/sidebar"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeSwitcher
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
        >
            <SidebarProvider>
                <div className="flex h-screen w-full overflow-hidden">
                    {/* Sidebar - Full Height */}
                    <AdminSidebar />

                    {/* Main content area with topbar */}
                    <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                        {/* Topbar - Only spans content area */}
                        <AdminTopbar />

                        {/* Content */}
                        <main className="flex-1 p-6 overflow-auto min-h-0">
                            {children}
                        </main>

                        {/* Footer */}
                        <AdminFooter />
                    </div>
                </div>
            </SidebarProvider>
        </ThemeSwitcher>
    )
}

export default AdminLayout