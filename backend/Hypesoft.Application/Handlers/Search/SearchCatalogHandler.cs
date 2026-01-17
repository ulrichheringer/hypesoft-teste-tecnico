using AutoMapper;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Search;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Search;

public sealed class SearchCatalogHandler(
    IProductRepository products,
    ICategoryRepository categories,
    IMapper mapper)
    : IRequestHandler<SearchCatalogQuery, CatalogSearchResponse>
{
    public async Task<CatalogSearchResponse> Handle(SearchCatalogQuery request, CancellationToken ct)
    {
        var normalized = string.IsNullOrWhiteSpace(request.Term)
            ? null
            : request.Term.Trim();

        if (string.IsNullOrWhiteSpace(normalized))
        {
            return new CatalogSearchResponse(
                Array.Empty<ProductDto>(),
                0,
                Array.Empty<CategoryDto>(),
                0,
                string.Empty);
        }

        var take = request.Take <= 0 ? 5 : request.Take;

        var (productItems, productTotal) = await products.ListAsync(1, take, normalized, null, ct);
        var (categoryItems, categoryTotal) = await categories.ListAsync(1, take, normalized, ct);

        return new CatalogSearchResponse(
            productItems.Select(mapper.Map<ProductDto>).ToList(),
            productTotal,
            categoryItems.Select(mapper.Map<CategoryDto>).ToList(),
            categoryTotal,
            normalized);
    }
}
