using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class UpdateCategoryHandler(ICategoryRepository categories)
    : IRequestHandler<UpdateCategoryCommand, CategoryDto?>
{
    public async Task<CategoryDto?> Handle(UpdateCategoryCommand request, CancellationToken ct)
    {
        var category = await categories.GetByIdAsync(request.Id, ct);
        if (category is null) return null;

        var name = request.Request.Name.Trim();

        if (!string.Equals(category.Name, name, StringComparison.OrdinalIgnoreCase))
        {
            var exists = await categories.ExistsByNameAsync(name, ct);
            if (exists)
                throw new InvalidOperationException("Category name already exists.");
        }

        category.Rename(name);
        await categories.UpdateAsync(category, ct);

        return new CategoryDto(category.Id, category.Name);
    }
}
