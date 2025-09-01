'use client'
import UploadMedia from "@/components/application/Admin/UploadMedia"
import BreadCrumb from "@/components/application/Breadcrumb"
import { ADMIN_DASHBOARD, ADMIN_MEDIA } from "@/routes/AdminPanelRoutes"
import MediaGallery from "@/components/application/Admin/MediaGallery"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_MEDIA, label: "Media" }
]

const MediaPage = () => {
    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            <h2 className="mb-4">Media</h2>
            
            <div className="mb-4">
                <UploadMedia />
            </div>
            <MediaGallery />
        </div>
    )
}

export default MediaPage