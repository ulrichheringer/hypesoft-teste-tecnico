using Hypesoft.Application.Commands.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class DeleteProductHandler(IProductRepository products)
    : IRequestHandler<DeleteProductCommand, bool>
{
    public async Task<bool> Handle(DeleteProductCommand request, CancellationToken ct)
    {
        var product = await products.GetByIdAsync(request.Id, ct);
        if (product is null) return false;

        await products.DeleteAsync(request.Id, ct);
        return true;
    }
}
