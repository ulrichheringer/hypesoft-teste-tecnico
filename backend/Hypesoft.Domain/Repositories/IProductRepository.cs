using Hypesoft.Domain.Entities;

namespace Hypesoft.Domain.Repositories;

public interface IProductRepository
{
    Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct = default
    );

    Task AddAsync(Product product, CancellationToken ct = default);
    Task UpdateAsync(Product product, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);

    Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default);

    Task<long> CountAsync(CancellationToken ct = default);
    Task<decimal> GetTotalStockValueAsync(CancellationToken ct = default);
    Task<int> CountLowStockAsync(int threshold, CancellationToken ct = default);
    Task<IReadOnlyList<CategoryProductCount>> CountByCategoryAsync(CancellationToken ct = default);
}

public sealed record CategoryProductCount(Guid CategoryId, int Count);