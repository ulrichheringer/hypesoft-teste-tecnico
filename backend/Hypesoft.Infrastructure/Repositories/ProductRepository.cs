using System.Globalization;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Caching;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class ProductRepository(HypesoftDbContext db, IDistributedCache cache) : IProductRepository
{
    private const string StampKey = "products:stamp";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = CacheDuration
    };

    private static string GetByIdKey(Guid id) => $"products:by-id:{id}";

    private static string GetListKey(int page, int pageSize, string? search, Guid? categoryId, long stamp)
        => $"products:list:{page}:{pageSize}:{search}:{categoryId}:{stamp}";

    private static string GetLowStockKey(int threshold, long stamp)
        => $"products:low-stock:{threshold}:{stamp}";

    private async Task<long> GetStampAsync(CancellationToken ct)
    {
        var stampValue = await cache.GetStringSafeAsync(StampKey, ct);
        if (long.TryParse(stampValue, NumberStyles.Integer, CultureInfo.InvariantCulture, out var stamp))
        {
            return stamp;
        }

        stamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        await cache.SetStringSafeAsync(
            StampKey,
            stamp.ToString(CultureInfo.InvariantCulture),
            CacheOptions,
            ct);
        return stamp;
    }

    private Task BumpStampAsync(CancellationToken ct)
        => cache.SetStringSafeAsync(
            StampKey,
            DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(CultureInfo.InvariantCulture),
            CacheOptions,
            ct);

    public async Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var cacheKey = GetByIdKey(id);
        var cached = await cache.GetRecordAsync<ProductCacheItem>(cacheKey, ct);
        if (cached is not null)
        {
            return cached.ToEntity();
        }

        var product = await db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        if (product is not null)
        {
            await cache.SetRecordAsync(cacheKey, ProductCacheItem.From(product), CacheOptions, ct);
        }

        return product;
    }

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

        var stamp = await GetStampAsync(ct);
        var cacheKey = GetListKey(page, pageSize, normalizedSearch, categoryId, stamp);
        var cached = await cache.GetRecordAsync<CacheList<ProductCacheItem>>(cacheKey, ct);
        if (cached is not null)
        {
            var cachedItems = cached.Items.Select(item => item.ToEntity()).ToList();
            return (cachedItems, cached.Total);
        }

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

        var cachePayload = new CacheList<ProductCacheItem>(
            items.Select(ProductCacheItem.From).ToList(),
            total);

        await cache.SetRecordAsync(cacheKey, cachePayload, CacheOptions, ct);

        return ((IReadOnlyList<Product>)items, total);
    }

    public async Task AddAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Add(product);
        await db.SaveChangesAsync(ct);
        await BumpStampAsync(ct);
    }

    public async Task UpdateAsync(Product product, CancellationToken ct = default)
    {
        db.Products.Update(product);
        await db.SaveChangesAsync(ct);
        await cache.RemoveSafeAsync(GetByIdKey(product.Id), ct);
        await BumpStampAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Products.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Products.Remove(entity);
        await db.SaveChangesAsync(ct);
        await cache.RemoveSafeAsync(GetByIdKey(id), ct);
        await BumpStampAsync(ct);
    }

    public async Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
    {
        var stamp = await GetStampAsync(ct);
        var cacheKey = GetLowStockKey(threshold, stamp);

        var cached = await cache.GetRecordAsync<List<ProductCacheItem>>(cacheKey, ct);
        if (cached is not null)
        {
            return cached.Select(item => item.ToEntity()).ToList();
        }

        var items = await db.Products.AsNoTracking()
            .Where(x => x.Stock < threshold)
            .OrderBy(x => x.Stock)
            .ToListAsync(ct);

        await cache.SetRecordAsync(
            cacheKey,
            items.Select(ProductCacheItem.From).ToList(),
            CacheOptions,
            ct);

        return items;
    }

    public async Task<long> CountAsync(CancellationToken ct = default)
    {
        var stamp = await GetStampAsync(ct);
        var cacheKey = $"products:count:{stamp}";
        var cached = await cache.GetStringSafeAsync(cacheKey, ct);
        if (long.TryParse(cached, out var count))
        {
            return count;
        }

        count = await db.Products.AsNoTracking().LongCountAsync(ct);
        await cache.SetStringSafeAsync(cacheKey, count.ToString(), CacheOptions, ct);
        return count;
    }

    public async Task<decimal> GetTotalStockValueAsync(CancellationToken ct = default)
    {
        var stamp = await GetStampAsync(ct);
        var cacheKey = $"products:stock-value:{stamp}";
        var cached = await cache.GetStringSafeAsync(cacheKey, ct);
        if (decimal.TryParse(cached, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out var value))
        {
            return value;
        }

        var products = await db.Products.AsNoTracking()
            .Select(p => new { p.Price, p.Stock })
            .ToListAsync(ct);
        value = products.Sum(p => p.Price * p.Stock);

        await cache.SetStringSafeAsync(cacheKey, value.ToString(System.Globalization.CultureInfo.InvariantCulture), CacheOptions, ct);
        return value;
    }

    public async Task<int> CountLowStockAsync(int threshold, CancellationToken ct = default)
    {
        var stamp = await GetStampAsync(ct);
        var cacheKey = $"products:low-stock-count:{threshold}:{stamp}";
        var cached = await cache.GetStringSafeAsync(cacheKey, ct);
        if (int.TryParse(cached, out var count))
        {
            return count;
        }

        count = await db.Products.AsNoTracking().CountAsync(p => p.Stock < threshold, ct);
        await cache.SetStringSafeAsync(cacheKey, count.ToString(), CacheOptions, ct);
        return count;
    }

    public async Task<IReadOnlyList<CategoryProductCount>> CountByCategoryAsync(CancellationToken ct = default)
    {
        var stamp = await GetStampAsync(ct);
        var cacheKey = $"products:category-counts:{stamp}";
        var cached = await cache.GetRecordAsync<List<CategoryProductCount>>(cacheKey, ct);
        if (cached is not null)
        {
            return cached;
        }

        var categoryIds = await db.Products.AsNoTracking()
            .Select(p => p.CategoryId)
            .ToListAsync(ct);

        var counts = categoryIds
            .GroupBy(id => id)
            .Select(g => new CategoryProductCount(g.Key, g.Count()))
            .ToList();

        await cache.SetRecordAsync(cacheKey, counts, CacheOptions, ct);
        return counts;
    }

    private sealed record ProductCacheItem(
        Guid Id,
        string Name,
        string Description,
        decimal Price,
        int Stock,
        Guid CategoryId,
        DateTime CreatedAt)
    {
        public static ProductCacheItem From(Product product)
            => new(
                product.Id,
                product.Name,
                product.Description,
                product.Price,
                product.Stock,
                product.CategoryId,
                product.CreatedAt);

        public Product ToEntity()
            => Product.Rehydrate(Id, Name, Description, Price, Stock, CategoryId, CreatedAt);
    }
}
