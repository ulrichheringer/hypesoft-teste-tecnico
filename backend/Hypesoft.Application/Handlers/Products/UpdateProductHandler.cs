using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class UpdateProductHandler(IProductRepository products, ICategoryRepository categories)
    : IRequestHandler<UpdateProductCommand, ProductDto?>
{
    public async Task<ProductDto?> Handle(UpdateProductCommand request, CancellationToken ct)
    {
        var product = await products.GetByIdAsync(request.Id, ct);
        if (product is null) return null;

        var name = request.Request.Name.Trim();
        var description = request.Request.Description.Trim();

        var category = await categories.GetByIdAsync(request.Request.CategoryId, ct);
        if (category is null)
            throw new InvalidOperationException("Category not found.");

        product.Update(
            name,
            description,
            request.Request.Price,
            request.Request.Stock,
            request.Request.CategoryId);

        await products.UpdateAsync(product, ct);

        return new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.CategoryId);
    }
}
