using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class ProductRepository(HypesoftDbContext db) : IProductRepository
{
    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct = default)
    {
        var query = db.Products.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalized = search.Trim().ToLowerInvariant();
            query = query.Where(x => x.Name.ToLower().Contains(normalized));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId.Value);
        }

        var total = await query.LongCountAsync(ct);

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        return (items, total);
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Update(product);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Products.Remove(entity);
        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
        => await db.Products.AsNoTracking()
            .Where(x => x.Stock < threshold)
            .OrderBy(x => x.Stock)
            .ToListAsync(ct);
}
