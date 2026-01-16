using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Products;

public sealed class CreateProductHandler(IProductRepository products, ICategoryRepository categories)
    : IRequestHandler<CreateProductCommand, ProductDto>
{
    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var name = request.Request.Name.Trim();
        var description = request.Request.Description.Trim();

        var category = await categories.GetByIdAsync(request.Request.CategoryId, ct);
        if (category is null)
            throw new KeyNotFoundException("Category not found.");

        var product = new Product(
            name,
            description,
            request.Request.Price,
            request.Request.Stock,
            request.Request.CategoryId);

        await products.AddAsync(product, ct);

        return new ProductDto(
            product.Id,
            product.Name,
            product.Description,
            product.Price,
            product.Stock,
            product.CategoryId);
    }
}
