import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
  fullBleed = false
}: {
  container?: boolean;
  className?: string;
  contentClassName?: string;
  fullBleed?: boolean;
}): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const currency = useAppStore((s) => s.currency);
  const setCurrency = useAppStore((s) => s.setCurrency);
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
        <header className="sticky top-0 z-30 flex h-20 items-center gap-4 border-b border-border/40 bg-background/60 px-6 backdrop-blur-2xl sm:px-10 w-full shrink-0">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="h-12 w-12 rounded-xl bg-white shadow-sm border border-border/50 hover:bg-black hover:text-white transition-all" />
            <div className="hidden sm:block">
               <div className="flex flex-col">
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/50">LEAfrique Artisans</p>
                 <p className="text-xs font-serif font-black italic text-black/80">Atelier Suite v2.0</p>
               </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Select value={currency} onValueChange={(v) => setCurrency(v as any)}>
              <SelectTrigger className="w-[120px] h-11 rounded-xl border-border/50 bg-white font-black text-sm shadow-sm text-black">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/50 shadow-2xl">
                <SelectItem value="USD" className="text-sm font-bold">USD ($)</SelectItem>
                <SelectItem value="EUR" className="text-sm font-bold">EUR (€)</SelectItem>
                <SelectItem value="NGN" className="text-sm font-bold">NGN (₦)</SelectItem>
                <SelectItem value="GBP" className="text-sm font-bold">GBP (£)</SelectItem>
                <SelectItem value="KES" className="text-sm font-bold">KES (KSh)</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-10 w-px bg-border/40 mx-1" />
            <ThemeToggle className="static h-12 w-12 rounded-xl bg-white border border-border/50 hover:bg-black hover:text-white text-black" />
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
              "flex-1 overflow-y-auto min-w-0",
              !fullBleed && container && "max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10 md:py-12 lg:py-16 w-full",
              fullBleed && "p-0",
              contentClassName
            )}
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
        <Toaster richColors closeButton position="top-right" expand={false} />
      </SidebarInset>
    </SidebarProvider>
  );
}