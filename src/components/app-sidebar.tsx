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
    <Sidebar className="border-r border-sidebar-border bg-sidebar-background">
      <SidebarHeader className="border-b border-sidebar-border px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green text-white shadow-lg shadow-black/10">
            <Store className="h-6 w-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-serif font-bold tracking-tight text-sidebar-foreground leading-tight">LEAfrique</span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/60">Artisanal Atelier</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/40">
            Workshop Menu
          </SidebarGroupLabel>
          <SidebarMenu className="mt-4 space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 h-12",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-md"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent/20 hover:text-sidebar-foreground"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/40 group-hover:text-sidebar-foreground"
                      )} />
                      <span className="font-bold tracking-tight">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 bg-black/5">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-9 w-9 rounded-full bg-brand-brown/30 flex items-center justify-center font-bold text-sidebar-foreground">
            {user?.name?.[0]}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-sidebar-foreground">{user?.name}</span>
            <span className="text-[9px] text-sidebar-foreground/50 uppercase font-bold tracking-widest">Master Craftsman</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 rounded-xl text-sidebar-foreground/60 hover:bg-destructive hover:text-destructive-foreground transition-all h-11"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}