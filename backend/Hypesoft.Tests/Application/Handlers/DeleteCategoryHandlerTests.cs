using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class DeleteCategoryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnFalse_WhenCategoryNotFound()
    {
        var categories = new CategoryRepositoryStub { Category = null };
        var products = new ProductRepositoryStub();
        var handler = new DeleteCategoryHandler(categories, products);

        var result = await handler.Handle(new DeleteCategoryCommand(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task Handle_ShouldDelete_WhenCategoryHasNoProducts()
    {
        var category = new Category("Books");
        var categories = new CategoryRepositoryStub { Category = category };
        var products = new ProductRepositoryStub { ListResult = (Array.Empty<Product>(), 0) };
        var handler = new DeleteCategoryHandler(categories, products);

        var result = await handler.Handle(new DeleteCategoryCommand(category.Id), CancellationToken.None);

        result.Should().BeTrue();
        categories.DeletedId.Should().Be(category.Id);
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenCategoryHasProducts()
    {
        var category = new Category("Electronics");
        var categories = new CategoryRepositoryStub { Category = category };
        var product = new Product("Phone", "Smartphone", 500m, 10, category.Id);
        var products = new ProductRepositoryStub { ListResult = (new[] { product }, 1) };
        var handler = new DeleteCategoryHandler(categories, products);

        Func<Task> act = () => handler.Handle(new DeleteCategoryCommand(category.Id), CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*1 produto(s)*");
    }
}
