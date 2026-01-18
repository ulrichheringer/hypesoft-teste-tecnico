using Hypesoft.Application.Commands.Categories;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Categories;

public sealed class DeleteCategoryHandler(ICategoryRepository categories, IProductRepository products)
    : IRequestHandler<DeleteCategoryCommand, bool>
{
    public async Task<bool> Handle(DeleteCategoryCommand request, CancellationToken ct)
    {
        var category = await categories.GetByIdAsync(request.Id, ct);
        if (category is null) return false;

        var (productsInCategory, count) = await products.ListAsync(1, 1, null, request.Id, ct);
        if (count > 0)
            throw new InvalidOperationException($"Não é possível excluir a categoria. Existem {count} produto(s) associado(s).");

        await categories.DeleteAsync(request.Id, ct);
        return true;
    }
}
