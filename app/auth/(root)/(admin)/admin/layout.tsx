import AdminSidebar from "@/components/application/Admin/AdminSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

const Adminlayout = ({ children }: any) => {
    return (
        <div>
            <SidebarProvider>
                <AdminSidebar />
                <main>
                    {children}
                </main>
            </SidebarProvider>
        </div>
    )
}

export default Adminlayout