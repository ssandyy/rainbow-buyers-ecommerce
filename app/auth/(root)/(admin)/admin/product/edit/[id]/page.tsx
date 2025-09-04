import BreadCrumb from "@/components/application/Breadcrumb"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    // { href: ADMIN_PRODUCT_EDIT, label: "Update Products" }
]
const EditProduct = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            EditProduct
        </div>
    )
}

export default EditProduct