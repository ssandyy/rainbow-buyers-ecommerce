import {
    Image,
    LayoutDashboard,
    Package,
    Percent,
    Settings,
    ShoppingCart,
    Star,
    Tag,
    Users
} from "lucide-react"

import { ADMIN_CATEGORY_ADD, ADMIN_CATEGORY_SHOW, ADMIN_DASHBOARD, ADMIN_MEDIA, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoutes"


export const adminSidebarMenu = [
    {
        title: "Dashboard",
        url: ADMIN_DASHBOARD,
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "#",
        icon: Users,
    },

    {
        title: "Category",
        url: "#",
        icon: Tag,
        subMenu: [
            { title: "Add Category", url: ADMIN_CATEGORY_ADD },
            { title: "All Category", url: ADMIN_CATEGORY_SHOW },
            // {
            //     title: "Sub Category",
            //     url: "#",
            //     subMenu: [
            //         { title: "Add Sub Category", url: "#" },
            //         { title: "All Sub Category", url: "#" }
            //     ]
            // }
        ]

    },
    {
        title: "Product",
        url: "#",
        icon: Package,
        subMenu: [
            { title: "Add Product", url: ADMIN_PRODUCT_ADD },
            { title: "All Product", url: ADMIN_PRODUCT_SHOW }
            // { title: "Add Variants", url: ADMIN_PRODUCT_EDIT }
        ]
    },

    {
        title: "Orders",
        url: "#",
        icon: ShoppingCart,
        subMenu: [
            { title: "Add Order", url: "#" },
            { title: "All Orders", url: "#" }
        ]
    },
    {
        title: "Rating and Reviews",
        url: "#",
        icon: Star,
    },
    {
        title: "Media",
        url: ADMIN_MEDIA,
        icon: Image,
        // subMenu: [
        //     { title: "Add Media", url: "#" },
        //     { title: "All Media", url: ADMIN_MEDIA }
        // ]
    },
    {
        title: "Coupons",
        url: "#",
        icon: Percent,
        subMenu: [
            { title: "Add Coupons", url: "#" },
            { title: "All Coupons", url: "#" }
        ]
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    }
]