using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class ProductRepository(HypesoftDbContext db, IMemoryCache cache) : IProductRepository
{
    private const string StampKey = "products:stamp";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);

    private static string GetByIdKey(Guid id) => $"products:by-id:{id}";

    private static string GetListKey(int page, int pageSize, string? search, Guid? categoryId, long stamp)
        => $"products:list:{page}:{pageSize}:{search}:{categoryId}:{stamp}";

    private static string GetLowStockKey(int threshold, long stamp)
        => $"products:low-stock:{threshold}:{stamp}";

    private long GetStamp()
    {
        if (!cache.TryGetValue(StampKey, out long stamp))
        {
            stamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
            cache.Set(StampKey, stamp);
        }

        return stamp;
    }

    private void BumpStamp()
    {
        cache.Set(StampKey, DateTimeOffset.UtcNow.ToUnixTimeMilliseconds());
    }

    public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => cache.GetOrCreateAsync(GetByIdKey(id), entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            return db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        })!;

    public async Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct = default)
    {
        var normalizedSearch = string.IsNullOrWhiteSpace(search)
            ? null
            : search.Trim().ToLowerInvariant();

        var stamp = GetStamp();
        var cacheKey = GetListKey(page, pageSize, normalizedSearch, categoryId, stamp);

        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;

            var query = db.Products.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(normalizedSearch))
            {
                query = query.Where(x => x.Name.ToLower().Contains(normalizedSearch));
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

            return ((IReadOnlyList<Product>)items, total);
        });
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        BumpStamp();
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Update(product);
        await db.SaveChangesAsync(ct);
        cache.Remove(GetByIdKey(product.Id));
        BumpStamp();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Products.Remove(entity);
        await db.SaveChangesAsync(ct);
        cache.Remove(GetByIdKey(id));
        BumpStamp();
    }

    public async Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
    {
        var stamp = GetStamp();
        var cacheKey = GetLowStockKey(threshold, stamp);

        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            var items = await db.Products.AsNoTracking()
                .Where(x => x.Stock < threshold)
                .OrderBy(x => x.Stock)
                .ToListAsync(ct);
            return (IReadOnlyList<Product>)items;
        });
    }
}
