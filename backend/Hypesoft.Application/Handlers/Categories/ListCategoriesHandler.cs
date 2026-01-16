using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class ListCategoriesHandler(ICategoryRepository categories)
    : IRequestHandler<ListCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    public async Task<IReadOnlyList<CategoryDto>> Handle(ListCategoriesQuery request, CancellationToken ct)
    {
        var items = await categories.ListAsync(ct);
        return items.Select(x => new CategoryDto(x.Id, x.Name)).ToList();
    }
}