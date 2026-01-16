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
}