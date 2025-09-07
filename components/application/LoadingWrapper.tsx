"use client"

import { Suspense, ReactNode } from "react"
import { 
  ProductCardSkeleton, 
  TableRowSkeleton, 
  FormSkeleton, 
  NavbarSkeleton, 
  DashboardSkeleton,
  Skeleton 
} from "@/components/ui/skeleton-enhanced"

interface LoadingWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  type?: "product" | "table" | "form" | "navbar" | "dashboard" | "default"
  count?: number
}

const getFallbackComponent = (type: string, count: number = 1) => {
  switch (type) {
    case "product":
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )
    case "table":
      return (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">
                  <Skeleton variant="shimmer" size="sm" className="w-16" />
                </th>
                <th className="p-4 text-left">
                  <Skeleton variant="shimmer" size="sm" className="w-20" />
                </th>
                <th className="p-4 text-left">
                  <Skeleton variant="shimmer" size="sm" className="w-24" />
                </th>
                <th className="p-4 text-left">
                  <Skeleton variant="shimmer" size="sm" className="w-16" />
                </th>
                <th className="p-4 text-left">
                  <Skeleton variant="shimmer" size="sm" className="w-20" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, i) => (
                <TableRowSkeleton key={i} />
              ))}
            </tbody>
          </table>
        </div>
      )
    case "form":
      return <FormSkeleton />
    case "navbar":
      return <NavbarSkeleton />
    case "dashboard":
      return <DashboardSkeleton />
    default:
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        </div>
      )
  }
}

export const LoadingWrapper = ({ 
  children, 
  fallback, 
  type = "default", 
  count = 6 
}: LoadingWrapperProps) => {
  const defaultFallback = fallback || getFallbackComponent(type, count)

  return (
    <Suspense fallback={defaultFallback}>
      {children}
    </Suspense>
  )
}

// Specialized loading wrappers for common use cases
export const ProductGridLoading = ({ count = 8 }: { count?: number }) => (
  <LoadingWrapper type="product" count={count} />
)

export const TableLoading = ({ count = 5 }: { count?: number }) => (
  <LoadingWrapper type="table" count={count} />
)

export const FormLoading = () => (
  <LoadingWrapper type="form" />
)

export const DashboardLoading = () => (
  <LoadingWrapper type="dashboard" />
)

export const NavbarLoading = () => (
  <LoadingWrapper type="navbar" />
)

export default LoadingWrapper



