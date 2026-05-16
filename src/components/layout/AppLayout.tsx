import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/use-app-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export function AppLayout({
  container = true,
  className,
  contentClassName,
  fullBleed: manualFullBleed,
  children
}: {
  container?: boolean;
  className?: string;
  contentClassName?: string;
  fullBleed?: boolean;
  children?: React.ReactNode;
}): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);
  const currency = useAppStore(s => s.currency);
  const setCurrency = useAppStore(s => s.setCurrency);
  const isPOS = location.pathname.includes("/pos");
  const fullBleed = manualFullBleed || isPOS;
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  if (!isAuthenticated) return null;
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("bg-background min-w-0 flex flex-col relative", className)}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-2xl sm:px-8 w-full shrink-0">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex flex-col">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-foreground/40 leading-none">LEAfrique Artisans</p>
              <p className="text-xs font-serif font-bold italic text-foreground mt-0.5">Atelier Suite v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
              <SelectTrigger className="w-[100px] h-9 rounded-lg border-border bg-card font-bold text-xs shadow-sm text-foreground">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-border shadow-2xl bg-card">
                <SelectItem value="USD" className="text-xs font-bold">USD ($)</SelectItem>
                <SelectItem value="EUR" className="text-xs font-bold">EUR (€)</SelectItem>
                <SelectItem value="NGN" className="text-xs font-bold">NGN (₦)</SelectItem>
                <SelectItem value="GBP" className="text-xs font-bold">GBP (£)</SelectItem>
                <SelectItem value="KES" className="text-xs font-bold">KES (KSh)</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-8 w-px bg-border mx-1" />
            <ThemeToggle className="static h-9 w-9 rounded-lg bg-card border border-border hover:bg-primary hover:text-primary-foreground text-foreground flex items-center justify-center p-0" />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex-1 overflow-y-auto min-w-0 custom-scrollbar",
              !fullBleed && container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6 lg:py-8 w-full",
              fullBleed && "p-0 h-[calc(100vh-theme(spacing.16))]",
              contentClassName
            )}
          >
            <div className={cn(!fullBleed && "space-y-8")}>
              {children || <Outlet />}
            </div>
          </motion.main>
        </AnimatePresence>
        <Toaster richColors closeButton position="top-right" expand={false} />
      </SidebarInset>
    </SidebarProvider>
  );
}