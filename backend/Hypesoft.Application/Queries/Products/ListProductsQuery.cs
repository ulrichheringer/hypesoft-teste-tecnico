using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Products;

public sealed record ListProductsQuery(
    int Page = 1,
    int PageSize = 20,
    string? Search = null,
    Guid? CategoryId = null) : IRequest<PagedProductsResponse>;
