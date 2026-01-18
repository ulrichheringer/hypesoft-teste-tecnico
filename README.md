# Hypesoft

Sistema de gestao de produtos com dashboard, controle de estoque e categorias.

## Stack

- **Backend:** .NET 9, MongoDB, Redis, MediatR, FluentValidation
- **Frontend:** Next.js 14, React Query, Tailwind, Shadcn/ui, Zod
- **Auth:** Keycloak (OAuth2/OIDC)
- **Observability:** Prometheus, Grafana
- **Proxy:** Nginx

## Rodando com Docker

```bash
docker compose up -d
```

## Keycloak

O realm `hypesoft` e importado automaticamente. Nao precisa configurar nada.

### Usuarios

| Usuario | Senha | Role  | Permissoes                          |
|---------|-------|-------|-------------------------------------|
| admin   | admin  | admin | Dashboard, Produtos, Categorias     |
| user    | user | user  | Apenas Dashboard (somente leitura)  |

Console admin: http://localhost:8080 (admin/admin)

### URLs

| Servico       | URL                              | Credenciais        |
|---------------|----------------------------------|-------------------|
| Aplicacao     | http://localhost                 | admin/admin        |
| Frontend      | http://localhost:3000            | admin/admin        |
| API           | http://localhost:5000            | -                 |
| Swagger       | http://localhost:5000/swagger    | -                 |
| Scalar        | http://localhost:5000/scalar  | -                 |
| Keycloak      | http://localhost:8080            | admin/admin       |
| Grafana       | http://localhost:3001            | admin/admin       |
| Mongo Express | http://localhost:8081            | -                 |
| Prometheus    | http://localhost:9090            | -                 |

**Nota:** A porta 80 (Nginx) roteia automaticamente para o frontend e API.

## Documentacao da API

### Swagger
Acesse http://localhost:5000/swagger

### Scalar
Acesse http://localhost:5000/scalar

Para autenticar nas ferramentas:
1. Obtenha um token no Keycloak
   Exemplo com curl:
   ```bash
   curl -s -X POST "http://localhost:8080/realms/hypesoft/protocol/openid-connect/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=password" \
     -d "client_id=hypesoft-frontend" \
     -d "username=admin" \
     -d "password=admin"
   ```
2. Clique em "Authorize" e insira: `Bearer {token}`

## Desenvolvimento Local

### Backend

```bash
cd backend
dotnet restore
dotnet run --project Hypesoft.API
```

Requer MongoDB e Redis rodando:

```bash
docker compose up -d mongodb redis keycloak
```

### Frontend

```bash
cd frontend
bun install
bun dev
```

## Observabilidade

### Grafana

Acesse http://localhost:3001 (admin/admin).

Dashboards disponiveis:
- **Hypesoft Overview:** metricas combinadas
- **API Overview:** metricas do .NET
- **Frontend Overview:** metricas do Next.js, como CPU, RAM, etc

### Prometheus

Coleta metricas da API e Frontend.
Configuracao em `observability/prometheus.yml`.

### Alertas

Regras configuradas para:
- API ou Frontend down (>2 min)
- Latencia alta (p95 >1s)
- Memoria acima de 500MB

Para alertas por email, configure SMTP no .env

## Testes

### Backend

```bash
cd backend
dotnet test
```

- 64 testes (unitarios + integracao)
- Cobertura: ~89%

### Frontend

```bash
cd frontend
bun run test
```


## Estrutura do Projeto

```
backend/
  Hypesoft.API/          # Controllers, middlewares
  Hypesoft.Application/  # Commands, queries, handlers (CQRS)
  Hypesoft.Domain/       # Entidades, interfaces
  Hypesoft.Infrastructure/ # Repositorios, EF Core
  Hypesoft.Tests/        # Testes unitarios e integracao

frontend/
  app/                   # Next.js pages
  components/            # React components
  hooks/                 # Custom hooks
  services/              # API clients
  test/                  # Testes vitest

docs/
  ADR.md                 # Architecture Decision Records
  Hypesoft.postman_collection.json
```

## ADRs

Decisoes arquiteturais documentadas em `docs/ADR.md`:
- Clean Architecture com CQRS (requisito)
- MongoDB com EF Core (requisito)
- Keycloak para autenticacao (requisito)
- Redis para cache (decisão minha)