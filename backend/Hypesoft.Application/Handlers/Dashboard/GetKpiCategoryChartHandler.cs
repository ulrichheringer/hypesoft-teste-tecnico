using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public sealed class GetKpiCategoryChartHandler(IProductRepository products, ICategoryRepository categories)
    : IRequestHandler<GetKpiCategoryChartQuery, IReadOnlyList<CategoryChartItemDto>>
{
    public async Task<IReadOnlyList<CategoryChartItemDto>> Handle(GetKpiCategoryChartQuery request, CancellationToken ct)
    {
        var counts = await products.CountByCategoryAsync(ct);
        var (categoryList, _) = await categories.ListAsync(1, 1000, null, ct);

        var categoryNames = categoryList.ToDictionary(c => c.Id, c => c.Name);

        return counts
            .Select(c => new CategoryChartItemDto(
                categoryNames.TryGetValue(c.CategoryId, out var name) ? name : "Sem categoria",
                c.Count))
            .OrderByDescending(c => c.Value)
            .ToList();
    }
}
