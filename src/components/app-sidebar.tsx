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
  const user = useAppStore(s => s.user);
  const logout = useAppStore(s => s.logout);
  const userName = user?.name;
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <Sidebar collapsible="none" className="bg-sidebar border-r-2 border-sidebar-border w-[280px] min-w-[280px] h-screen shrink-0 overflow-hidden flex flex-col z-40">
      <SidebarHeader className="border-b-2 border-sidebar-border/5 px-8 py-12">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-2xl">
            <Store className="h-8 w-8" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-2xl font-serif font-black tracking-tighter text-foreground leading-tight truncate">LEAfrique</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40">Atelier Suite v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-10 custom-scrollbar flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 text-[11px] font-black uppercase tracking-[0.3em] text-foreground/30 mb-6">
            Workshop Navigator
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-3">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-5 rounded-2xl px-6 py-4 transition-all duration-300 h-16",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-2xl scale-[1.02]"
                        : "text-foreground/60 hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0 transition-colors",
                        isActive ? "text-primary-foreground" : "opacity-40 group-hover:opacity-100"
                      )} />
                      <span className="font-black tracking-tight text-xl">{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2 border-sidebar-border/5 p-8 bg-sidebar-accent/50">
        <div className="flex items-center gap-5 mb-8 px-2">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-black text-2xl shadow-xl uppercase">
            {userName?.[0] || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-black text-foreground truncate">{userName}</span>
            <span className="text-[10px] text-foreground/40 uppercase font-black tracking-[0.2em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-5 rounded-2xl text-foreground/40 hover:bg-primary hover:text-primary-foreground transition-all h-16 px-6"
        >
          <LogOut className="h-6 w-6" />
          <span className="font-black text-xl">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}