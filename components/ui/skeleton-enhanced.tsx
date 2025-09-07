import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  "animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
  {
    variants: {
      variant: {
        default: "bg-gray-200 dark:bg-gray-800",
        shimmer: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_ease-in-out_infinite] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
        pulse: "bg-gray-200 animate-pulse dark:bg-gray-800",
        wave: "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[wave_1.5s_ease-in-out_infinite] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800",
      },
      size: {
        default: "h-4 w-full",
        sm: "h-3 w-3/4",
        lg: "h-6 w-full",
        xl: "h-8 w-full",
        "2xl": "h-12 w-full",
        circle: "h-10 w-10 rounded-full",
        "circle-sm": "h-6 w-6 rounded-full",
        "circle-lg": "h-16 w-16 rounded-full",
      }
    },
    defaultVariants: {
      variant: "shimmer",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {}

function Skeleton({ className, variant, size, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

// Pre-built skeleton components for common use cases
export const ProductCardSkeleton = () => (
  <div className="border rounded-lg p-4 space-y-3">
    <Skeleton variant="shimmer" size="2xl" className="rounded-lg" />
    <div className="space-y-2">
      <Skeleton variant="shimmer" size="lg" />
      <Skeleton variant="shimmer" size="sm" />
      <Skeleton variant="shimmer" size="sm" className="w-2/3" />
    </div>
    <div className="flex justify-between items-center">
      <Skeleton variant="shimmer" size="lg" className="w-20" />
      <Skeleton variant="shimmer" size="default" className="w-16" />
    </div>
  </div>
)

export const TableRowSkeleton = () => (
  <tr className="border-b">
    <td className="p-4">
      <Skeleton variant="shimmer" size="circle" />
    </td>
    <td className="p-4">
      <Skeleton variant="shimmer" size="default" />
    </td>
    <td className="p-4">
      <Skeleton variant="shimmer" size="sm" className="w-3/4" />
    </td>
    <td className="p-4">
      <Skeleton variant="shimmer" size="default" className="w-20" />
    </td>
    <td className="p-4">
      <Skeleton variant="shimmer" size="default" className="w-16" />
    </td>
  </tr>
)

export const FormSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton variant="shimmer" size="sm" className="w-20" />
      <Skeleton variant="shimmer" size="default" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="shimmer" size="sm" className="w-24" />
      <Skeleton variant="shimmer" size="default" />
    </div>
    <div className="space-y-2">
      <Skeleton variant="shimmer" size="sm" className="w-32" />
      <Skeleton variant="shimmer" size="lg" />
    </div>
    <div className="flex gap-4">
      <Skeleton variant="shimmer" size="default" className="w-24" />
      <Skeleton variant="shimmer" size="default" className="w-20" />
    </div>
  </div>
)

export const NavbarSkeleton = () => (
  <div className="border-b bg-gray-100 dark:bg-gray-800">
    <div className="container mx-auto flex items-center justify-between py-3 px-6">
      <Skeleton variant="shimmer" size="lg" className="w-32" />
      <div className="flex items-center gap-3">
        <Skeleton variant="shimmer" size="sm" className="w-16" />
        <Skeleton variant="shimmer" size="sm" className="w-20" />
        <Skeleton variant="shimmer" size="default" className="w-24" />
      </div>
    </div>
  </div>
)

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton variant="shimmer" size="sm" className="w-20" />
              <Skeleton variant="shimmer" size="lg" className="w-16" />
            </div>
            <Skeleton variant="shimmer" size="circle-lg" />
          </div>
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
        <Skeleton variant="shimmer" size="lg" className="w-40 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton variant="shimmer" size="circle-sm" />
              <Skeleton variant="shimmer" size="default" className="flex-1" />
              <Skeleton variant="shimmer" size="sm" className="w-16" />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
        <Skeleton variant="shimmer" size="lg" className="w-32 mb-4" />
        <Skeleton variant="shimmer" size="2xl" className="h-64 rounded-lg" />
      </div>
    </div>
  </div>
)

export { Skeleton, skeletonVariants }

