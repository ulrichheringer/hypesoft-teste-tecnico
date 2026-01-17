"use client";

import { LogIn } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status, login } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-mesh px-4">
        <div className="w-full max-w-sm animate-pulse rounded-2xl bg-card p-8 card-shadow">
          <div className="h-6 w-40 rounded-full bg-muted" />
          <div className="mt-6 h-3 w-52 rounded-full bg-muted" />
          <div className="mt-10 h-12 w-full rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-mesh px-4">
        <Card className="w-full max-w-md rounded-2xl border border-white/60 bg-white/90 shadow-xl backdrop-blur">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <p className="font-display text-2xl font-semibold text-foreground">
                Hypesoft Dashboard
              </p>
              <p className="text-sm text-muted-foreground">
                Acesse sua conta para gerenciar produtos e categorias com seguranca.
              </p>
            </div>
            <Button
              className="w-full gap-2 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={login}
            >
              <LogIn size={18} />
              Entrar com Keycloak
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
