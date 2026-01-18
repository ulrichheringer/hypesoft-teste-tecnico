"use client";

import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-mesh px-2 py-3 sm:px-3">
      <div className="flex min-h-0 w-full flex-1 flex-col">
        <div className="flex min-h-0 flex-1 flex-col gap-6 rounded-[20px] border border-white/70 bg-white/80 p-4 shadow-xl backdrop-blur">
          <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[260px_1fr]">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
            <main className="flex min-h-0 flex-col gap-6">
              <div className="flex items-center justify-between lg:hidden">
                <MobileSidebar />
                <p className="font-display text-xl font-bold text-foreground">
                  Hypesoft
                </p>
              </div>
              <Topbar />
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
