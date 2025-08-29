'use client'
import UploadMedia from "@/components/application/Admin/UploadMedia"
import BreadCrumb from "@/components/application/Breadcrumb"


const breadCrumbData = [{ href: "/admin/dashboard", label: "Home" }, { href: "/admin", label: "Admin" }, { href: "/admin/media", label: "Media" }]
const MediaPage = () => {
    return (

        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <h2>Media</h2>
            <UploadMedia />

        </div>
    )
}

export default MediaPage