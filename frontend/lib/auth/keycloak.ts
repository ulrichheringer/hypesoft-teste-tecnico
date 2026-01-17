import Keycloak from "keycloak-js";

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8080",
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "hypesoft",
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "hypesoft-frontend",
};

export const keycloak = new Keycloak(keycloakConfig);
