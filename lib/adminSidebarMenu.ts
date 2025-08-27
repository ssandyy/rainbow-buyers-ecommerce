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

export const adminSidebarMenu = [
    {
        title: "Dashboard",
        url: "#",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "#",
        icon: Users,
    },
    {
        title: "Settings",
        url: "#",
        icon: Settings,
    },
    {
        title: "Category",
        url: "#",
        icon: Tag,
        subMenu: [
            { title: "Add Category", url: "#" },
            { title: "All Category", url: "#" }
        ]
    },
    {
        title: "Product",
        url: "#",
        icon: Package,
        subMenu: [
            { title: "Add Product", url: "#" },
            { title: "All Product", url: "#" },
            { title: "Add Variants", url: "#" }
        ]
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
        url: "#",
        icon: Image,
        subMenu: [
            { title: "Add Media", url: "#" },
            { title: "All Media", url: "#" }
        ]
    }
]