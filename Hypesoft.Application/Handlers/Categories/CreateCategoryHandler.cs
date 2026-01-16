using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class CreateCategoryHandler(ICategoryRepository categories)
    : IRequestHandler<CreateCategoryCommand, CategoryDto>
{
    public async Task<CategoryDto> Handle(CreateCategoryCommand request, CancellationToken ct)
    {
        var name = request.Request.Name.Trim();

        var exists = await categories.ExistsByNameAsync(name, ct);
        if (exists)
            throw new InvalidOperationException("Category name already exists.");

        var category = new Category(name);
        await categories.AddAsync(category, ct);

        return new CategoryDto(category.Id, category.Name);
    }
}