using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;
using AutoMapper;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class GetCategoryByIdHandler(ICategoryRepository categories, IMapper mapper)
    : IRequestHandler<GetCategoryByIdQuery, CategoryDto?>
{
    public async Task<CategoryDto?> Handle(GetCategoryByIdQuery request, CancellationToken ct)
    {
        var category = await categories.GetByIdAsync(request.Id, ct);
        return category is null ? null : mapper.Map<CategoryDto>(category);
    }
}
