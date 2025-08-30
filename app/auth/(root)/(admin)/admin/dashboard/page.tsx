import BreadCrumb from "@/components/application/Breadcrumb"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"


const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },

]

const AdminDashboard = () => {
    return (
        <>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <div className="flex items-center justify-center h-full w-full">
                <h2 className="text-3xl">AdminDashboard</h2>
            </div>
        </>

    )
}

export default AdminDashboard