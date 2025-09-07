"use client"

import BreadCrumb from "@/components/application/Breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoutes"
import { useOptimizedFetch } from "@/hooks/useOptimizedFetch"
import { LoadingWrapper } from "@/components/application/LoadingWrapper"
import { 
    Users, 
    Package, 
    ShoppingCart, 
    DollarSign, 
    TrendingUp, 
    Eye,
    Plus,
    BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
]

const AdminDashboard = () => {
    const { data: products, loading: productsLoading } = useOptimizedFetch('/api/product', {
        immediate: true,
        cacheTime: 2 * 60 * 1000, // 2 minutes
    })

    const { data: categories, loading: categoriesLoading } = useOptimizedFetch('/api/category', {
        immediate: true,
        cacheTime: 5 * 60 * 1000, // 5 minutes
    })

    const { data: media, loading: mediaLoading } = useOptimizedFetch('/api/media', {
        immediate: true,
        cacheTime: 3 * 60 * 1000, // 3 minutes
    })

    const stats = [
        {
            title: "Total Products",
            value: products?.data?.meta?.total || 0,
            icon: Package,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            href: "/auth/admin/product"
        },
        {
            title: "Categories",
            value: categories?.data?.meta?.total || 0,
            icon: BarChart3,
            color: "text-green-600",
            bgColor: "bg-green-100",
            href: "/auth/admin/category"
        },
        {
            title: "Media Files",
            value: media?.data?.meta?.total || 0,
            icon: Eye,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            href: "/auth/admin/media"
        },
        {
            title: "Total Users",
            value: "1,234", // Mock data
            icon: Users,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            href: "#"
        },
        {
            title: "Orders",
            value: "567", // Mock data
            icon: ShoppingCart,
            color: "text-red-600",
            bgColor: "bg-red-100",
            href: "#"
        },
        {
            title: "Revenue",
            value: "$12,345", // Mock data
            icon: DollarSign,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100",
            href: "#"
        }
    ]

    return (
        <>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                    <h1 className="text-3xl font-bold mb-2">Welcome to Admin Dashboard</h1>
                    <p className="text-blue-100">Manage your ecommerce store efficiently</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Button asChild className="h-20 flex flex-col gap-2" variant="outline">
                        <Link href="/auth/admin/product/add">
                            <Plus className="h-6 w-6" />
                            <span>Add Product</span>
                        </Link>
                    </Button>
                    <Button asChild className="h-20 flex flex-col gap-2" variant="outline">
                        <Link href="/auth/admin/category/add">
                            <Plus className="h-6 w-6" />
                            <span>Add Category</span>
                        </Link>
                    </Button>
                    <Button asChild className="h-20 flex flex-col gap-2" variant="outline">
                        <Link href="/auth/admin/media">
                            <Eye className="h-6 w-6" />
                            <span>Manage Media</span>
                        </Link>
                    </Button>
                    <Button asChild className="h-20 flex flex-col gap-2" variant="outline">
                        <Link href="#">
                            <TrendingUp className="h-6 w-6" />
                            <span>View Reports</span>
                        </Link>
                    </Button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </CardTitle>
                                <div className={`p-2 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <Button asChild variant="ghost" className="mt-2 p-0 h-auto">
                                    <Link href={stat.href} className="text-xs text-blue-600 hover:text-blue-800">
                                        View Details →
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Products</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <LoadingWrapper type="table" count={3}>
                                <div className="space-y-3">
                                    {products?.data?.data?.slice(0, 3).map((product: any, index: number) => (
                                        <div key={index} className="flex items-center space-x-4">
                                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                                <Package className="h-5 w-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium">{product.name}</p>
                                                <p className="text-sm text-gray-600">${product.sellingPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </LoadingWrapper>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>System Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Database</span>
                                    <span className="text-green-600 text-sm">✓ Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">API Server</span>
                                    <span className="text-green-600 text-sm">✓ Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Email Service</span>
                                    <span className="text-green-600 text-sm">✓ Online</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">File Storage</span>
                                    <span className="text-green-600 text-sm">✓ Online</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default AdminDashboard