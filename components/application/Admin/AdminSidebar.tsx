import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { adminSidebarMenu } from "@/lib/adminSidebarMenu"
import Logo from "@/public/heart.png"
import { ChevronDown, PanelRightOpen } from "lucide-react"
import Image from "next/image"


const AdminSidebar = () => {
    return (
        <div>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center justify-between border-b ">
                        <Image src={Logo} width={50} height={50} alt="logo" />
                        <Button className="ml-auto">
                            <PanelRightOpen color="#000000" />
                        </Button>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            {adminSidebarMenu.map((menu, index) => (
                                <SidebarMenuItem key={index}>
                                    {menu.subMenu ? (
                                        // ✅ Wrap only items that have a submenu in a Collapsible
                                        <Collapsible className="group/collapsible">
                                            <CollapsibleTrigger asChild>
                                                <SidebarMenuButton>
                                                    <menu.icon className="w-4 h-4 mr-2" />
                                                    {menu.title}
                                                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                                </SidebarMenuButton>
                                            </CollapsibleTrigger>

                                            <CollapsibleContent>
                                                <SidebarMenuSub>
                                                    {menu.subMenu.map((item, subIndex) => (
                                                        <SidebarMenuSubItem key={subIndex}>
                                                            <SidebarMenuSubButton>{item.title}</SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ))}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    ) : (
                                        // ✅ Regular item without submenu
                                        <SidebarMenuButton>
                                            <menu.icon className="w-4 h-4 mr-2" />
                                            {menu.title}
                                        </SidebarMenuButton>
                                    )}
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter />
            </Sidebar>
        </div>
    )
}

export default AdminSidebar
