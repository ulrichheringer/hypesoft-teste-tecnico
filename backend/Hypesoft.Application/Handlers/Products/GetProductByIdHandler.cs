using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class GetProductByIdHandler(IProductRepository products)
    : IRequestHandler<GetProductByIdQuery, ProductDto?>
{
    public async Task<ProductDto?> Handle(GetProductByIdQuery request, CancellationToken ct)
    {
        var product = await products.GetByIdAsync(request.Id, ct);
        return product is null
            ? null
            : new ProductDto(product.Id, product.Name, product.Description, product.Price, product.Stock, product.CategoryId);
    }
}
