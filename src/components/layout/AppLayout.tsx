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
import { CurrencyCode } from "@/store/use-app-store";
type AppLayoutProps = {
  children?: React.ReactNode;
  container?: boolean;
  className?: string;
  contentClassName?: string;
  fullBleed?: boolean;
};
export function AppLayout({
  children,
  container = true,
  className,
  contentClassName,
  fullBleed = false
}: AppLayoutProps): JSX.Element {
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
      <SidebarInset className={cn("bg-slate-50 dark:bg-background", className)}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">LEAfrique Tailors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Select value={currency} onValueChange={(v) => setCurrency(v as CurrencyCode)}>
              <SelectTrigger className="w-[85px] h-9 rounded-lg border-slate-200">
                <SelectValue placeholder="USD" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="NGN">NGN (₦)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
                <SelectItem value="KES">KES (KSh)</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle className="static" />
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={cn(
              "flex-1",
              !fullBleed && container && "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 lg:py-12 w-full",
              fullBleed && "p-0",
              contentClassName
            )}
          >
            {children || <Outlet />}
          </motion.main>
        </AnimatePresence>
        <Toaster richColors closeButton position="top-center" />
      </SidebarInset>
    </SidebarProvider>
  );
}