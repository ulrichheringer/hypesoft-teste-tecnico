# ADR 001: Clean Architecture com CQRS

## Status
Aceito

## Contexto
O sistema precisa de uma arquitetura que permita escalabilidade, testabilidade e separacao clara de responsabilidades.

## Decisao
Adotar Clean Architecture com CQRS (Command Query Responsibility Segregation) usando MediatR.

## Estrutura
- Domain: entidades, interfaces de repositorio
- Application: commands, queries, handlers, DTOs, validators
- Infrastructure: implementacao de repositorios, EF Core, cache
- API: controllers, middlewares, configuracao

## Consequencias
- Positivas: codigo testavel, baixo acoplamento, facil manutencao
- Negativas: mais boilerplate, curva de aprendizado inicial


# ADR 002: MongoDB com EF Core Provider

## Status
Aceito

## Contexto
Requisito do desafio especifica MongoDB como banco de dados.

## Decisao
Usar o provider MongoDB.Driver.EntityFrameworkCore para manter compatibilidade com EF Core.

## Consequencias
- Positivas: API familiar do EF Core, suporte a LINQ
- Negativas: algumas features do EF Core nao funcionam (migrations, relationships)


# ADR 003: Keycloak para Autenticacao

## Status
Aceito

## Contexto
Sistema precisa de autenticacao robusta com roles e SSO.

## Decisao
Integrar Keycloak como identity provider usando OAuth2/OpenID Connect.

## Consequencias
- Positivas: SSO, gerenciamento de usuarios centralizado, roles
- Negativas: dependencia externa, configuracao inicial complexa


# ADR 004: Redis para Cache

## Status
Aceito

## Contexto
Consultas frequentes precisam de cache para performance.

## Decisao
Usar Redis como cache distribuido via IDistributedCache.

## Consequencias
- Positivas: performance, cache compartilhado entre instancias
- Negativas: mais um servico para gerenciar
