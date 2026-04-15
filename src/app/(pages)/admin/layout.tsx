import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DatabaseIcon, Home, HomeIcon } from "lucide-react"

export default function AdminLayout({ children }: any) {
    const data: any = {
        documents: [
            {
                name: "home page",
                url: "/",
                icon: (
                    <HomeIcon
                    />
                ),
            },
            {
                name: "admin",
                url: "/admin",
                icon: (
                    <DatabaseIcon
                    />
                ),
            },
            {
                name: "categories",
                url: "/admin/categories",
                icon: (
                    <DatabaseIcon
                    />
                ),
            },
        ],
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" data={data} />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                            {children}
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
