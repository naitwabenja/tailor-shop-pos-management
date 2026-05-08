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
  const user = useAppStore((s) => s.user);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Sidebar collapsible="none" className="border-r border-sidebar-border bg-sidebar-background min-w-[280px] h-screen">
      <SidebarHeader className="border-b border-sidebar-border px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green text-white shadow-lg shadow-black/20">
            <Store className="h-7 w-7" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-serif font-bold tracking-tight text-sidebar-foreground leading-tight">LEAfrique</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/60">Atelier Suite v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-8">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-bold uppercase tracking-[0.3em] text-sidebar-foreground/40 mb-4">
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
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-xl shadow-black/10"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0 transition-colors",
                        isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground"
                      )} />
                      <span className="font-bold tracking-tight text-base">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-6 bg-black/10">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="h-11 w-11 rounded-2xl bg-brand-brown/30 flex items-center justify-center font-bold text-sidebar-foreground text-lg border border-white/10 shadow-sm">
            {user?.name?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-sidebar-foreground">{user?.name}</span>
            <span className="text-[9px] text-sidebar-foreground/50 uppercase font-bold tracking-[0.2em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-4 rounded-2xl text-sidebar-foreground/60 hover:bg-destructive hover:text-destructive-foreground transition-all h-14 px-5"
        >
          <LogOut className="h-6 w-6" />
          <span className="font-bold text-base">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}