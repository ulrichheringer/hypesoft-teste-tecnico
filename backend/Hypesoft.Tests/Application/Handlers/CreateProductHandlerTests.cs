using FluentAssertions;
using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Tests.Application.Handlers;

public class CreateProductHandlerTests
{
    [Fact]
    public async Task Handle_ShouldThrow_WhenCategoryNotFound()
    {
        var products = new ProductRepositoryStub();
        var categories = new CategoryRepositoryStub { Category = null };
        var handler = new CreateProductHandler(products, categories);
        var command = new CreateProductCommand(new CreateProductRequest(
            "Notebook",
            "Gaming",
            5000m,
            2,
            Guid.NewGuid()));

        Func<Task> act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<KeyNotFoundException>()
            .WithMessage("Category not found.");
    }

    [Fact]
    public async Task Handle_ShouldCreateProduct_WhenCategoryExists()
    {
        var category = new Category("Electronics");
        var products = new ProductRepositoryStub();
        var categories = new CategoryRepositoryStub { Category = category };
        var handler = new CreateProductHandler(products, categories);
        var command = new CreateProductCommand(new CreateProductRequest(
            "Notebook",
            "Gaming",
            5000m,
            2,
            category.Id));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Name.Should().Be("Notebook");
        result.CategoryId.Should().Be(category.Id);
        products.Added.Should().NotBeNull();
        products.Added!.Name.Should().Be("Notebook");
    }

    private sealed class ProductRepositoryStub : IProductRepository
    {
        public Product? Added { get; private set; }

        public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
            int page,
            int pageSize,
            string? search,
            Guid? categoryId,
            CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task AddAsync(Product product, CancellationToken ct = default)
        {
            Added = product;
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Product product, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
            => throw new NotImplementedException();
    }

    private sealed class CategoryRepositoryStub : ICategoryRepository
    {
        public Category? Category { get; set; }

        public Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => Task.FromResult(Category);

        public Task<(IReadOnlyList<Category> Items, long Total)> ListAsync(
            int page,
            int pageSize,
            string? search,
            CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task AddAsync(Category category, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task UpdateAsync(Category category, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
            => throw new NotImplementedException();
    }
}
