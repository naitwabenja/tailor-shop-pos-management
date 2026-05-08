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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-brand-forest" },
  { name: "POS Terminal", href: "/dashboard/pos", icon: Calculator, color: "text-brand-saddle" },
  { name: "Customers", href: "/dashboard/customers", icon: Users, color: "text-brand-moss" },
  { name: "Order Tracking", href: "/dashboard/orders", icon: Scissors, color: "text-brand-wood" },
  { name: "Measurements", href: "/dashboard/measurements", icon: Ruler, color: "text-brand-soil" },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package, color: "text-brand-forest" },
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
    <Sidebar collapsible="none" className="wood-panel min-w-[280px] w-[280px] h-screen shrink-0 overflow-hidden">
      <SidebarHeader className="border-b border-brand-saddle/10 px-8 py-10 bg-brand-tan/10">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soil text-brand-wheat shadow-2xl">
            <Store className="h-7 w-7" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-2xl font-serif font-black tracking-tighter text-brand-soil leading-tight truncate">LEAfrique</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-saddle/60">Atelier Suite v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-8 custom-scrollbar">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[11px] font-black uppercase tracking-[0.3em] text-brand-soil/40 mb-4">
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
                      "group relative flex items-center gap-4 rounded-2xl px-5 py-4 transition-all duration-300 h-14",
                      isActive
                        ? "bg-brand-soil text-brand-wheat shadow-xl ring-1 ring-brand-saddle/20"
                        : "text-brand-soil/70 hover:bg-brand-wheat/80 hover:text-brand-soil"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0 transition-colors",
                        isActive ? "text-brand-wheat" : cn("opacity-50 group-hover:opacity-100", item.color)
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
      <SidebarFooter className="border-t border-brand-saddle/10 p-6 bg-brand-soil/5">
        <div className="flex items-center gap-4 mb-6 px-2">
          <div className="h-11 w-11 shrink-0 rounded-2xl bg-brand-soil/10 flex items-center justify-center font-black text-brand-soil text-lg border border-brand-soil/10 shadow-sm uppercase">
            {userName?.[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-brand-soil truncate">{userName}</span>
            <span className="text-[9px] text-brand-saddle/50 uppercase font-black tracking-[0.2em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-4 rounded-2xl text-brand-soil/60 hover:bg-brand-soil hover:text-white transition-all h-14 px-5"
        >
          <LogOut className="h-6 w-6" />
          <span className="font-bold text-lg">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}