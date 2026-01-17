"use client";

import type { KeycloakProfile, KeycloakTokenParsed } from "keycloak-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { keycloak } from "@/lib/auth/keycloak";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  token: string | null;
  profile: KeycloakProfile | null;
  roles: string[];
  login: () => void;
  logout: () => void;
  hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function extractRoles(token?: KeycloakTokenParsed | null): string[] {
  const realmAccess = token?.realm_access;
  if (!realmAccess || !Array.isArray(realmAccess.roles)) {
    return [];
  }

  return realmAccess.roles.filter(Boolean);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<KeycloakProfile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const init = async () => {
      try {
        const authenticated = await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
          silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
        });

        if (!active) {
          return;
        }

        setStatus(authenticated ? "authenticated" : "unauthenticated");
        setToken(keycloak.token ?? null);
        setRoles(extractRoles(keycloak.tokenParsed));

        if (authenticated) {
          const loadedProfile = await keycloak.loadUserProfile();
          if (active) {
            setProfile(loadedProfile);
          }
        }
      } catch {
        if (active) {
          setStatus("unauthenticated");
          setToken(null);
          setProfile(null);
          setRoles([]);
        }
      }
    };

    init();

    keycloak.onTokenExpired = () => {
      keycloak
        .updateToken(60)
        .then((refreshed) => {
          if (refreshed && active) {
            setToken(keycloak.token ?? null);
            setRoles(extractRoles(keycloak.tokenParsed));
          }
        })
        .catch(() => {
          if (active) {
            setStatus("unauthenticated");
            setToken(null);
            setProfile(null);
            setRoles([]);
          }
        });
    };

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(() => {
    keycloak.login();
  }, []);

  const logout = useCallback(() => {
    const redirectUri = window.location.origin;
    keycloak.logout({ redirectUri });
  }, []);

  const hasRole = useCallback(
    (role: string) => roles.some((item) => item.toLowerCase() === role.toLowerCase()),
    [roles],
  );

  const value = useMemo(
    () => ({
      status,
      token,
      profile,
      roles,
      login,
      logout,
      hasRole,
    }),
    [status, token, profile, roles, login, logout, hasRole],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
