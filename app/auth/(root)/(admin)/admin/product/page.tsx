"use client"

import BreadCrumb from "@/components/application/Breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN_DASHBOARD, ADMIN_PRODUCT_SHOW } from "@/routes/AdminPanelRoutes"
import { useFetch } from "@/hooks/use-fetch"
import Link from "next/link"
import { Plus, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Dashboard" },
    { href: ADMIN_PRODUCT_SHOW, label: "Products" }
]

interface Product {
    _id: string
    name: string
    slug: string
    description: string
    category: {
        _id: string
        name: string
        slug: string
    }
    mrp: number
    sellingPrice: number
    discount: number
    media: Array<{
        _id: string
        path: string
        thumbnail_url: string
        title: string
    }>
    createdAt: string
    updatedAt: string
}

interface ProductResponse {
    success: boolean
    statusCode: number
    message: string
    data: {
        data: Product[]
        meta: {
            total: number
            page: number
            limit: number
            totalPages: number
        }
    }
}

const ShowProducts = () => {
    const { data, isLoading, error } = useFetch<ProductResponse>("/api/product")

    if (isLoading) {
        return (
            <div>
                <BreadCrumb breadCrumbData={breadCrumbData} />
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg">Loading products...</div>
                </div>
            </div>
        )
    }

    if (error || !data?.success) {
        return (
            <div>
                <BreadCrumb breadCrumbData={breadCrumbData} />
                <div className="flex items-center justify-center h-64">
                    <div className="text-lg text-red-500">Error loading products</div>
                </div>
            </div>
        )
    }

    const products = data.data.data

    return (
        <div>
            <BreadCrumb breadCrumbData={breadCrumbData} />
            
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Products</h1>
                <Link href="/auth/admin/product/add">
                    <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Button>
                </Link>
            </div>

            {products.length === 0 ? (
                <Card>
                    <CardContent className="flex items-center justify-center h-32">
                        <div className="text-center">
                            <p className="text-gray-500 mb-4">No products found</p>
                            <Link href="/auth/admin/product/add">
                                <Button>Add Your First Product</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <Card key={product._id} className="overflow-hidden">
                            <div className="relative h-48">
                                {product.media && product.media.length > 0 ? (
                                    <Image
                                        src={product.media[0].path}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            
                            <CardHeader>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <p className="text-sm text-gray-600">{product.category.name}</p>
                            </CardHeader>
                            
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">MRP:</span>
                                        <span className="font-medium">₹{product.mrp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Selling Price:</span>
                                        <span className="font-medium text-green-600">₹{product.sellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Discount:</span>
                                        <span className="font-medium text-red-600">{product.discount}%</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-2 mt-4">
                                    <Link href={`/auth/admin/product/edit/${product._id}`} className="flex-1">
                                        <Button variant="outline" size="sm" className="w-full">
                                            <Edit className="w-4 h-4 mr-1" />
                                            Edit
                                        </Button>
                                    </Link>
                                    <Button variant="destructive" size="sm" className="flex-1">
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        Delete
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {data.data.meta.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                    <div className="text-sm text-gray-500">
                        Page {data.data.meta.page} of {data.data.meta.totalPages} 
                        ({data.data.meta.total} total products)
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowProducts