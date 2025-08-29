"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { adminSidebarMenu } from "@/lib/adminSidebarMenu"
import Logo from "@/public/heart.png"
import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen, User2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"
import AdminSignout from "./AdminSignout"

// Define proper types
interface MenuItem {
    title: string
    icon?: React.ComponentType<{ className?: string }>
    url?: string
    subMenu?: MenuItem[]
}

// 🔄 Recursive renderer for any depth
const RenderMenu = ({ items, isSub = false }: { items: MenuItem[]; isSub?: boolean }) => {
    const pathname = usePathname()
    const Wrapper = isSub ? SidebarMenuSub : SidebarMenu
    const ItemWrapper = isSub ? SidebarMenuSubItem : SidebarMenuItem
    const ButtonComponent = isSub ? SidebarMenuSubButton : SidebarMenuButton

    return (
        <Wrapper>
            {items.map((item, i) => {
                const isActive = pathname === item.url

                return (
                    <ItemWrapper key={`${item.title}-${i}`}>
                        {item.subMenu ? (
                            <Collapsible defaultOpen={item.subMenu.some(subItem => subItem.url === pathname)}>
                                <CollapsibleTrigger asChild>
                                    <ButtonComponent className="w-full justify-between">
                                        <div className="flex items-center">
                                            {item.icon && <item.icon className="w-4 h-4 mr-3 shrink-0" />}
                                            <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                        </div>
                                        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 data-[state=open]:rotate-180 group-data-[collapsible=icon]:hidden" />
                                    </ButtonComponent>
                                </CollapsibleTrigger>

                                <CollapsibleContent className="overflow-hidden transition-all duration-200 data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down group-data-[collapsible=icon]:hidden">
                                    <div className="pl-4 mt-1">
                                        <RenderMenu items={item.subMenu} isSub />
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        ) : (
                            <ButtonComponent
                                asChild
                                className={`w-full justify-start ${isActive
                                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                    : 'hover:bg-accent hover:text-accent-foreground'
                                    }`}
                                tooltip={item.title}
                            >
                                <Link href={item.url || '#'}>
                                    {item.icon && <item.icon className="w-4 h-4 mr-3 shrink-0" />}
                                    <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
                                </Link>
                            </ButtonComponent>
                        )}
                    </ItemWrapper>
                )
            })}
        </Wrapper>
    )
}

const AdminSidebar = () => {
    const { open, setOpen } = useSidebar()
    // const toggleSidebar = useSidebar()

    const auth = useSelector((store: any) => store.auth)


    return (
        <Sidebar collapsible="icon" className="border-r  bg-background z-30 relative">
            {/* Toggle Button on Border - Higher z-index */}
            <div className="hidden md:block absolute -right-4 top-12 z-50">
                <Button
                    onClick={() => setOpen(!open)}
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 rounded-full border-2 border-purple-700 bg-background shadow-lg hover:bg-purple-500 hover:text-white transition-colors"
                >
                    {open ? (
                        <PanelLeftClose className="h-3 w-3" />
                    ) : (
                        <PanelLeftOpen className="h-3 w-3" />
                    )}
                </Button>
            </div>

            {/* Header with Logo */}
            <SidebarHeader className="border-b">
                <div className="flex items-center justify-center py-2">
                    <div className="flex items-center">
                        <div className="relative w-8 h-8 shrink-0">
                            <Image
                                src={Logo}
                                alt="Admin Logo"
                                fill
                                className="object-contain "
                                priority
                            />
                        </div>
                        <span className="ml-3 font-semibold text-lg truncate group-data-[collapsible=icon]:hidden">
                            Admin Panel
                        </span>
                    </div>
                    {/* <div className="md:hidden absolute -right-4 cursor-pointer">
                        <Button onClick={() => setOpen(!open)}
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 rounded-full border-2 border-purple-700 bg-background shadow-lg hover:bg-purple-500 hover:text-white transition-colors"
                        >
                            <PanelLeftClose className="h-3 w-3" />
                        </Button>
                    </div> */}

                </div>


            </SidebarHeader>


            {/* Menu */}
            <SidebarContent className="px-2 py-4">
                <SidebarGroup>
                    <RenderMenu items={adminSidebarMenu} />
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton className="w-full">
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>
                                            <User2 className="w-4 h-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="group-data-[collapsible=icon]:hidden">{auth?.user.name}</span>
                                    <ChevronUp className="ml-auto w-4 h-4 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width] z-50"
                            >
                                <DropdownMenuItem>
                                    <span>Account</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <AdminSignout />
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}

export default AdminSidebar