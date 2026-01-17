using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class UpdateProductStockHandler(IProductRepository products)
    : IRequestHandler<UpdateProductStockCommand, ProductDto?>
{
    public async Task<ProductDto?> Handle(UpdateProductStockCommand request, CancellationToken ct)
    {
        var product = await products.GetByIdAsync(request.Id, ct);
        if (product is null) return null;

        product.UpdateStock(request.Request.Stock);
        await products.UpdateAsync(product, ct);

        return new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.CategoryId,
            product.CreatedAt);
    }
}
