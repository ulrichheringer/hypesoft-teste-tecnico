using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Categories;

public sealed record ListCategoriesQuery(
    int Page = 1,
    int PageSize = 50,
    string? Search = null) : IRequest<PagedCategoriesResponse>;
