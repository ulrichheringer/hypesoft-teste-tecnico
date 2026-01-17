"use client";

import { Bell, ChevronDown, LogOut, Search } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
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

export function Topbar() {
  const { profile, logout, roles } = useAuth();
  const initials = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .map((part) => part?.[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex w-full items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2 shadow-sm">
        <Search className="text-muted-foreground" size={18} />
        <Input
          className="border-0 bg-transparent px-0 text-sm focus-visible:ring-0"
          placeholder="Buscar produto, categoria ou sku"
        />
        <Button variant="ghost" size="icon" className="hidden lg:inline-flex">
          <ChevronDown size={16} />
        </Button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Atualizado ha 2 min
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-2xl border border-border">
            <Bell size={18} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex h-auto items-center gap-3 rounded-2xl border border-border bg-white px-4 py-2"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials || "HS"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left text-xs lg:block">
                  <p className="font-semibold text-foreground">
                    {profile?.firstName || "Miguel"} {profile?.lastName || "Santos"}
                  </p>
                  <p className="text-muted-foreground">
                    {roles[0] ? `Role: ${roles[0]}` : "Shop Admin"}
                  </p>
                </div>
                <ChevronDown size={16} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Preferencias</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut size={14} className="mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
