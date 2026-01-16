using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class ListCategoriesHandler(ICategoryRepository categories)
    : IRequestHandler<ListCategoriesQuery, PagedCategoriesResponse>
{
    public async Task<PagedCategoriesResponse> Handle(ListCategoriesQuery request, CancellationToken ct)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 50 : request.PageSize;
        var search = string.IsNullOrWhiteSpace(request.Search) ? null : request.Search.Trim();

        var (items, total) = await categories.ListAsync(page, pageSize, search, ct);

        var dtos = items.Select(x => new CategoryDto(x.Id, x.Name)).ToList();

        return new PagedCategoriesResponse(dtos, total, page, pageSize);
    }
}
