using FluentAssertions;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class GetProductByIdHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnNull_WhenNotFound()
    {
        var products = new ProductRepositoryStub { Product = null };
        var mapper = TestMapper.Create();
        var handler = new GetProductByIdHandler(products, mapper);

        var result = await handler.Handle(new GetProductByIdQuery(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldReturnDto_WhenFound()
    {
        var product = new Product("Name", "Desc", 15m, 3, Guid.NewGuid());
        var products = new ProductRepositoryStub { Product = product };
        var mapper = TestMapper.Create();
        var handler = new GetProductByIdHandler(products, mapper);

        var result = await handler.Handle(new GetProductByIdQuery(product.Id), CancellationToken.None);

        result.Should().NotBeNull();
        result!.Id.Should().Be(product.Id);
    }
}
