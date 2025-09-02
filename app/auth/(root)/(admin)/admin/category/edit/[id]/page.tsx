import BreadCrumb from "@/components/application/Breadcrumb"
import { ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Edit" }
]

const EditCategoryPage = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            EditCategoryPage
        </div>
    )
}

export default EditCategoryPage