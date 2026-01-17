using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class DeleteProductHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnFalse_WhenNotFound()
    {
        var products = new ProductRepositoryStub { Product = null };
        var handler = new DeleteProductHandler(products);

        var result = await handler.Handle(new DeleteProductCommand(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task Handle_ShouldDelete_WhenFound()
    {
        var product = new Product("Name", "Desc", 12m, 2, Guid.NewGuid());
        var products = new ProductRepositoryStub { Product = product };
        var handler = new DeleteProductHandler(products);

        var result = await handler.Handle(new DeleteProductCommand(product.Id), CancellationToken.None);

        result.Should().BeTrue();
        products.DeletedId.Should().Be(product.Id);
    }
}
