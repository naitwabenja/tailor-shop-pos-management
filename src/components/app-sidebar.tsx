import React from "react";
import {
  Calculator,
  Scissors,
  Store,
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
  { name: "POS Terminal", href: "/dashboard/pos", icon: Calculator },
  { name: "Order Tracking", href: "/dashboard/orders", icon: Scissors },
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
    <Sidebar collapsible="none" className="bg-sidebar border-r-2 border-sidebar-border w-[240px] min-w-[240px] h-screen shrink-0 overflow-hidden flex flex-col z-40">
      <SidebarHeader className="border-b-2 border-sidebar-border/5 px-6 py-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Store className="h-6 w-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-serif font-bold tracking-tighter text-foreground leading-tight truncate">LEAfrique</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-foreground/40">Atelier Suite</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-6 custom-scrollbar flex-1">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/30 mb-4">
            Workshop Navigator
          </SidebarGroupLabel>
          <SidebarMenu className="space-y-1.5">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 h-11",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-foreground/60 hover:bg-sidebar-accent hover:text-foreground"
                    )}
                  >
                    <Link to={item.href}>
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        isActive ? "text-primary-foreground" : "opacity-40 group-hover:opacity-100"
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
      <SidebarFooter className="border-t-2 border-sidebar-border/5 p-6 bg-sidebar-accent/50">
        <div className="flex items-center gap-4 mb-4 px-1">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-md uppercase">
            {userName?.[0] || 'A'}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold text-foreground truncate">{userName}</span>
            <span className="text-[9px] text-foreground/40 uppercase font-bold tracking-[0.1em]">Master Artisan</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-4 rounded-xl text-foreground/40 hover:bg-primary hover:text-primary-foreground transition-all h-11 px-4"
        >
          <LogOut className="h-5 w-5" />
          <span className="font-bold text-sm">Close Session</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}