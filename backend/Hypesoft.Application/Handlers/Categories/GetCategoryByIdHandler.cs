using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class GetCategoryByIdHandler(ICategoryRepository categories)
    : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken ct)
    {
        var category = await categories.GetByIdAsync(request.Id, ct);
        return category is null ? null : new CategoryDto(category.Id, category.Name);
    }
}
