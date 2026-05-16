import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/use-app-store";
import { useShallow } from "zustand/react/shallow";
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
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-2xl sm:px-10 w-full shrink-0">
          <div className="flex flex-1 items-center gap-4">
            <div className="flex flex-col">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground/40">LEAfrique Artisans</p>
              <p className="text-sm font-serif font-black italic text-foreground">Atelier Suite v2.0</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
              <SelectTrigger className="w-[120px] h-11 rounded-xl border-border bg-card font-black text-sm shadow-sm text-foreground">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border shadow-2xl bg-card">
                <SelectItem value="USD" className="text-sm font-bold">USD ($)</SelectItem>
                <SelectItem value="EUR" className="text-sm font-bold">EUR (€)</SelectItem>
                <SelectItem value="NGN" className="text-sm font-bold">NGN (₦)</SelectItem>
                <SelectItem value="GBP" className="text-sm font-bold">GBP (£)</SelectItem>
                <SelectItem value="KES" className="text-sm font-bold">KES (KSh)</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-10 w-px bg-border mx-1" />
            <ThemeToggle className="static h-12 w-12 rounded-xl bg-card border-2 border-border hover:bg-primary hover:text-primary-foreground text-foreground" />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "flex-1 overflow-y-auto min-w-0 custom-scrollbar",
              !fullBleed && container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 w-full",
              fullBleed && "p-0 h-[calc(100vh-theme(spacing.20))]",
              contentClassName
            )}
          >
            {children || <Outlet />}
          </motion.main>
        </AnimatePresence>
        <Toaster richColors closeButton position="top-right" expand={false} />
      </SidebarInset>
    </SidebarProvider>
  );
}