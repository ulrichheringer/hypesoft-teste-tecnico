using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class UpdateProductStockHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnNull_WhenProductMissing()
    {
        var products = new ProductRepositoryStub { Product = null };
        var mapper = TestMapper.Create();
        var handler = new UpdateProductStockHandler(products, mapper);
        var command = new UpdateProductStockCommand(Guid.NewGuid(), new UpdateProductStockRequest(2));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldUpdateStock_WhenProductExists()
    {
        var product = new Product("Name", "Desc", 12m, 2, Guid.NewGuid());
        var products = new ProductRepositoryStub { Product = product };
        var mapper = TestMapper.Create();
        var handler = new UpdateProductStockHandler(products, mapper);
        var command = new UpdateProductStockCommand(product.Id, new UpdateProductStockRequest(7));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Stock.Should().Be(7);
        products.Updated.Should().NotBeNull();
    }
}
