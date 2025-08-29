"use client"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import React from "react"

const BreadCrumb = ({
    breadCrumbData = [],
}: {
    breadCrumbData?: { href: string; label: string }[]
}) => {
    const pathname = usePathname()

    const fallbackLabel =
        pathname?.split("/").filter(Boolean).pop() || "Home"

    if (!breadCrumbData || breadCrumbData.length === 0) {
        return (
            <Breadcrumb className="mt-4 ml-2 border-b border-neutral-300">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>
                            {fallbackLabel.charAt(0).toUpperCase() +
                                fallbackLabel.slice(1)}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        )
    }

    return (
        <Breadcrumb className="ml-2 border-b border-neutral-300 flex">
            <BreadcrumbList>
                {breadCrumbData.map((item, index) => {
                    const isLast = index === breadCrumbData.length - 1
                    return (
                        <React.Fragment key={index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={item.href}>
                                        {item.label}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                            {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default BreadCrumb
