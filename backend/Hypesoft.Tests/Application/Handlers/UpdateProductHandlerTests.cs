using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class UpdateProductHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnNull_WhenProductNotFound()
    {
        var products = new ProductRepositoryStub { Product = null };
        var categories = new CategoryRepositoryStub { Category = new Category("Cat") };
        var mapper = TestMapper.Create();
        var handler = new UpdateProductHandler(products, categories, mapper);
        var command = new UpdateProductCommand(Guid.NewGuid(), new UpdateProductRequest(
            "Name",
            "Desc",
            12m,
            2,
            Guid.NewGuid()));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenCategoryNotFound()
    {
        var product = new Product("Name", "Desc", 12m, 2, Guid.NewGuid());
        var products = new ProductRepositoryStub { Product = product };
        var categories = new CategoryRepositoryStub { Category = null };
        var mapper = TestMapper.Create();
        var handler = new UpdateProductHandler(products, categories, mapper);
        var command = new UpdateProductCommand(product.Id, new UpdateProductRequest(
            "Name",
            "Desc",
            12m,
            2,
            Guid.NewGuid()));

        Func<Task> act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Category not found.");
    }

    [Fact]
    public async Task Handle_ShouldUpdateProduct_WhenValid()
    {
        var category = new Category("Category");
        var product = new Product("Name", "Desc", 12m, 2, category.Id);
        var products = new ProductRepositoryStub { Product = product };
        var categories = new CategoryRepositoryStub { Category = category };
        var mapper = TestMapper.Create();
        var handler = new UpdateProductHandler(products, categories, mapper);
        var command = new UpdateProductCommand(product.Id, new UpdateProductRequest(
            "Updated",
            "New Desc",
            20m,
            4,
            category.Id));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Name.Should().Be("Updated");
        products.Updated.Should().NotBeNull();
        products.Updated!.Price.Should().Be(20m);
    }
}
