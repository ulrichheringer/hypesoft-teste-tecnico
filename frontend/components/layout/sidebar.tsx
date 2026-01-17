"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { brand, navSections } from "@/components/layout/nav-data";

export function Sidebar() {
  const pathname = usePathname();
  const BrandIcon = brand.icon;

  return (
    <aside className="flex h-full w-full flex-col gap-6 rounded-2xl border border-sidebar-border bg-sidebar px-5 py-6 shadow-sm">
      <div className="flex items-center gap-3 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <BrandIcon size={20} />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-sidebar-foreground">
            {brand.name}
          </p>
          <p className="text-xs text-muted-foreground">{brand.tagline}</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-6">
        {navSections.map((section) => (
          <div key={section.label} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
              {section.label}
            </p>
            <div className="flex flex-col gap-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <Link
                    key={item.label}
                    href={item.disabled ? "#" : item.href}
                    aria-disabled={item.disabled}
                    className={cn(
                      "group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                      item.disabled
                        ? "cursor-not-allowed text-muted-foreground/60"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                      isActive &&
                        "bg-sidebar-accent text-sidebar-foreground shadow-sm",
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-transparent text-sidebar-foreground/70 group-hover:text-sidebar-foreground",
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

    </aside>
  );
}
