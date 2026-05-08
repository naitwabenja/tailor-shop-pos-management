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
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-black" },
  { name: "POS Terminal", href: "/dashboard/pos", icon: Calculator, color: "text-black" },
  { name: "Customers", href: "/dashboard/customers", icon: Users, color: "text-black" },
  { name: "Order Tracking", href: "/dashboard/orders", icon: Scissors, color: "text-black" },
  { name: "Measurements", href: "/dashboard/measurements", icon: Ruler, color: "text-black" },
  { name: "Inventory", href: "/dashboard/inventory", icon: Package, color: "text-black" },
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
    <Sidebar collapsible="none" className="bg-brand-wheat border-r-2 border-black/10 w-[280px] min-w-[280px] h-screen shrink-0 overflow-hidden flex flex-col z-40">
      <SidebarHeader className="border-b-2 border-black/5 px-8 py-12">
        <div className="flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-black text-white shadow-2xl">
            <Store className="h-8 w-8" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-2xl font-serif font-black tracking-tighter text-black leading-tight truncate">LEAfrique</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">Atelier Suite v2.0</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-10 custom-scrollbar flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-5 text-[11px] font-black uppercase tracking-[0.3em] text-black/30 mb-6">
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
                        ? "bg-black text-white shadow-2xl scale-[1.02]"
                        : "text-black/60 hover:bg-black/5 hover:text-black"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-6 w-6 shrink-0 transition-colors",
                        isActive ? "text-white" : "opacity-40 group-hover:opacity-100"
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
      <SidebarFooter className="border-t-2 border-black/5 p-8 bg-black/5">
        <div className="flex items-center gap-5 mb-8 px-2">
          <div className="h-14 w-14 shrink-0 rounded-2xl bg-black text-white flex items-center justify-center font-black text-2xl shadow-xl uppercase">
            {userName?.[0]}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-lg font-black text-black truncate">{userName}</span>
            <span className="text-[10px] text-black/40 uppercase font-black tracking-[0.2em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-5 rounded-2xl text-black/40 hover:bg-black hover:text-white transition-all h-16 px-6"
        >
          <LogOut className="h-6 w-6" />
          <span className="font-black text-xl">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}