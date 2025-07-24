import { Building, Calendar, CreditCard, Home, Import, Inbox, Search, Settings, ShoppingBasket, ShoppingCart, UserRound, Users } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Menu items.
const items = [
    {
        title: "Staff",
        url: "/staffs",
        icon: UserRound,
    },
    {
        title: "Customer",
        url: "/customers",
        icon: Users,
    },
    {
        title: "Product",
        url: "/products",
        icon: ShoppingBasket,
    },
    {
        title: "Supplier",
        url: "/suppliers",
        icon: Building,
    },
    {
        title: "order",
        url: "/orders",
        icon: ShoppingCart,
    },
    {
        title: "Payment",
        url: "/payments",
        icon: CreditCard,
    },
    {
        title: "Import",
        url: "/imports",
        icon: Import,
    },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
