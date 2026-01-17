using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Tests.Support;

public sealed class ProductRepositoryStub : IProductRepository
{
    public Product? Product { get; set; }
    public Product? Added { get; private set; }
    public Product? Updated { get; private set; }
    public Guid? DeletedId { get; private set; }
    public (int Page, int PageSize, string? Search, Guid? CategoryId)? ListArgs { get; private set; }
    public (IReadOnlyList<Product> Items, long Total) ListResult { get; set; }
        = (Array.Empty<Product>(), 0);
    public IReadOnlyList<Product> LowStockResult { get; set; } = Array.Empty<Product>();

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(Product);

    public Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct = default)
    {
        ListArgs = (page, pageSize, search, categoryId);
        return Task.FromResult(ListResult);
    }

    public Task AddAsync(Product product, CancellationToken ct = default)
    {
        Added = product;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        Updated = product;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        DeletedId = id;
        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
        => Task.FromResult(LowStockResult);
}

public sealed class CategoryRepositoryStub : ICategoryRepository
{
    public Category? Category { get; set; }
    public bool Exists { get; set; }
    public Category? Added { get; private set; }
    public Category? Updated { get; private set; }
    public Guid? DeletedId { get; private set; }
    public (int Page, int PageSize, string? Search)? ListArgs { get; private set; }
    public (IReadOnlyList<Category> Items, long Total) ListResult { get; set; }
        = (Array.Empty<Category>(), 0);

    public Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => Task.FromResult(Category);

    public Task<(IReadOnlyList<Category> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        ListArgs = (page, pageSize, search);
        return Task.FromResult(ListResult);
    }

    public Task AddAsync(Category category, CancellationToken ct = default)
    {
        Added = category;
        return Task.CompletedTask;
    }

    public Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        Updated = category;
        return Task.CompletedTask;
    }

    public Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        DeletedId = id;
        return Task.CompletedTask;
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
        => Task.FromResult(Exists);
}
