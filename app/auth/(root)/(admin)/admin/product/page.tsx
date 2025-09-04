import BreadCrumb from "@/components/application/Breadcrumb"
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoutes"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT_SHOW, label: "Products" }
]
const ShowProducts = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            ShowProducts</div>
    )
}

export default ShowProducts