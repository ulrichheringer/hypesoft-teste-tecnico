using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Search;

public sealed record SearchCatalogQuery(string Term, int Take = 5) : IRequest<CatalogSearchResponse>;
