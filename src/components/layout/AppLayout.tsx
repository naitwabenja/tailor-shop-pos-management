import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, Outlet } from "react-router-dom";
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
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className={cn("bg-slate-50 dark:bg-background", className)}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-1 items-center gap-4">
            <SidebarTrigger className="lg:hidden" />
            <div className="hidden lg:block">
               <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Atelier Operations System</p>
            </div>
          </div>
          <ThemeToggle className="static" />
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