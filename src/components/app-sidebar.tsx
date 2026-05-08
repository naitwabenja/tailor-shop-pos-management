import React from "react";
import {
  LayoutDashboard,
  Calculator,
  Users,
  Scissors,
  Store,
  Ruler,
  Package,
  LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/use-app-store";
const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "POS Terminal", href: "/dashboard/pos", icon: Calculator },
  { name: "Customers", href: "/dashboard/customers", icon: Users },
  { name: "Order Tracking", href: "/dashboard/orders", icon: Scissors },
  { name: "Measurements", href: "/dashboard/measurements", icon: Ruler },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package },
];
export function AppSidebar(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAppStore((s) => s.logout);
  const userName = useAppStore((s) => s.user?.name);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-sidebar-background min-w-[280px] w-[280px] h-screen shrink-0">
      <SidebarHeader className="border-b border-sidebar-border px-8 py-10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-xl">
            <Store className="h-7 w-7" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-2xl font-serif font-black tracking-tighter text-black leading-tight truncate">LEAfrique</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/60">Atelier Suite v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-8">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-black uppercase tracking-[0.3em] text-black/40 mb-4">
            Workshop Navigator
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-2">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-200 h-14",
                      isActive
                        ? "bg-white text-black shadow-lg ring-1 ring-black/5"
                        : "text-black/70 hover:bg-white/60 hover:text-black"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0 transition-colors",
                        isActive ? "text-black" : "text-black/30 group-hover:text-black"
                      )} />
                      <span className="font-bold tracking-tight text-lg">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-6 bg-black/5">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-black/10 flex items-center justify-center font-black text-black text-lg border border-black/5 shadow-sm uppercase">
            {userName?.[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-black truncate">{userName}</span>
            <span className="text-[9px] text-black/50 uppercase font-black tracking-[0.2em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-4 rounded-2xl text-black/60 hover:bg-black hover:text-white transition-all h-14 px-5"
        >
          <LogOut className="h-6 w-6" />
          <span className="font-bold text-lg">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}