using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class ListProductsHandler(IProductRepository products)
    : IRequestHandler<ListProductsQuery, PagedProductsResponse>
{
    public async Task<PagedProductsResponse> Handle(ListProductsQuery request, CancellationToken ct)
    {
        var page = request.Page <= 0 ? 1 : request.Page;
        var pageSize = request.PageSize <= 0 ? 20 : request.PageSize;
        var search = string.IsNullOrWhiteSpace(request.Search) ? null : request.Search.Trim();

        var (items, total) = await products.ListAsync(page, pageSize, search, request.CategoryId, ct);

        var dtos = items
            .Select(x => new ProductDto(x.Id, x.Name, x.Description, x.Price, x.Stock, x.CategoryId))
            .ToList();

        return new PagedProductsResponse(dtos, total, page, pageSize);
    }
}
