"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useI18n } from "@/components/i18n/i18n-provider";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCatalogSearch } from "@/hooks/use-catalog-search";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

export function Topbar() {
  const { profile, logout, roles, hasRole } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const isAdmin = hasRole("admin");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedSearch = useDebouncedValue(search, 200);
  const searchQuery = useCatalogSearch(isAdmin ? debouncedSearch : "", 5);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const normalizedSearch = debouncedSearch.trim();
  const results = searchQuery.data;
  const hasResults =
    (results?.products.length ?? 0) > 0 || (results?.categories.length ?? 0) > 0;
  const showResults = isAdmin && open && normalizedSearch.length > 1;

  const updatedMinutes = 2;
  const initials = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .map((part) => part?.[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  
  // Filtrar roles técnicas do Keycloak (offline_access, uma_authorization, etc)
  const userRoles = roles.filter(
    (role) => !['offline_access', 'uma_authorization', 'default-roles-hypesoft'].includes(role)
  );
  const primaryRole = userRoles[0]
    ? userRoles[0].charAt(0).toUpperCase() + userRoles[0].slice(1).toLowerCase()
    : "";

  const handleViewAll = useMemo(
    () => ({
      products: () => {
        router.push(`/products?search=${encodeURIComponent(normalizedSearch)}`);
        setOpen(false);
      },
      categories: () => {
        router.push(`/categories?search=${encodeURIComponent(normalizedSearch)}`);
        setOpen(false);
      },
    }),
    [normalizedSearch, router],
  );

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {isAdmin ? (
        <div className="relative w-full lg:max-w-xl" ref={containerRef}>
        <div className="flex w-full items-center gap-3 rounded-xl border border-border bg-white px-4 py-2 shadow-sm">
          <Search className="text-muted-foreground" size={18} />
          <Input
            className="text-sm"
            placeholder={t("topbar.searchPlaceholder")}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            aria-label={t("search.label")}
          />
          <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
            <ChevronDown size={16} />
          </Button>
        </div>

        {showResults ? (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
            <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("search.label")}
            </div>
            <div className="px-4 py-3">
              {searchQuery.isFetching ? (
                <p className="text-sm text-muted-foreground">{t("search.loading")}</p>
              ) : hasResults ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                      <span>{t("search.products")}</span>
                      <button
                        type="button"
                        className="text-primary"
                        onClick={handleViewAll.products}
                      >
                        {t("search.viewAll")}
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      {(results?.products ?? []).map((product) => (
                        <button
                          type="button"
                          key={product.id}
                          className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-sm hover:bg-muted"
                          onClick={handleViewAll.products}
                        >
                          <span className="truncate">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.stock} un
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold uppercase text-muted-foreground">
                      <span>{t("search.categories")}</span>
                      <button
                        type="button"
                        className="text-primary"
                        onClick={handleViewAll.categories}
                      >
                        {t("search.viewAll")}
                      </button>
                    </div>
                    <div className="mt-2 space-y-1">
                      {(results?.categories ?? []).map((category) => (
                        <button
                          type="button"
                          key={category.id}
                          className="flex w-full items-center rounded-lg px-2 py-1 text-left text-sm hover:bg-muted"
                          onClick={handleViewAll.categories}
                        >
                          <span className="truncate">{category.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{t("search.empty")}</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
      ) : (
        <div className="w-full lg:max-w-xl" />
      )}

      <div className="flex flex-wrap items-center gap-2 lg:gap-3">
        <div className="flex h-[52px] items-center gap-2 rounded-md border border-border bg-white px-3 text-xs text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {t("topbar.updatedAt", { minutes: updatedMinutes })}
        </div>
        <Select value={locale} onValueChange={(value) => setLocale(value as "pt-BR" | "en-US")}>
          <SelectTrigger className="!h-[52px] w-[80px] justify-center rounded-md bg-white text-[13px] font-medium shadow-sm px-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pt-BR">BR</SelectItem>
            <SelectItem value="en-US">US</SelectItem>
          </SelectContent>
        </Select>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "flex h-[52px] items-center gap-3 rounded-xl border border-border bg-white px-3",
                "min-w-[190px] justify-between",
              )}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials || "HS"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left text-xs lg:block">
                  <p className="font-semibold text-foreground">
                    {profile?.firstName || "Miguel"} {profile?.lastName || "Santos"}
                  </p>
                  <p className="text-muted-foreground">
                    {primaryRole
                      ? t("topbar.role", { role: primaryRole })
                      : t("topbar.defaultRole")}
                  </p>
                </div>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={logout}>
              <LogOut size={14} className="mr-2" />
              {t("topbar.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
