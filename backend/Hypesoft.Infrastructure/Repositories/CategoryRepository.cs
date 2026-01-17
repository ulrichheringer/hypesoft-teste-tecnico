using System.Globalization;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Caching;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class CategoryRepository(HypesoftDbContext db, IDistributedCache cache) : ICategoryRepository
{
    private const string StampKey = "categories:stamp";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = CacheDuration
    };

    private static string GetByIdKey(Guid id) => $"categories:by-id:{id}";

    private static string GetListKey(int page, int pageSize, string? search, long stamp)
        => $"categories:list:{page}:{pageSize}:{search}:{stamp}";

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

    public async Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        var cacheKey = GetByIdKey(id);
        var cached = await cache.GetRecordAsync<CategoryCacheItem>(cacheKey, ct);
        if (cached is not null)
        {
            return cached.ToEntity();
        }

        var category = await db.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        if (category is not null)
        {
            await cache.SetRecordAsync(cacheKey, CategoryCacheItem.From(category), CacheOptions, ct);
        }

        return category;
    }

    public async Task<(IReadOnlyList<Category> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        var normalized = string.IsNullOrWhiteSpace(search)
            ? null
            : search.Trim().ToLowerInvariant();

        var stamp = await GetStampAsync(ct);
        var cacheKey = GetListKey(page, pageSize, normalized, stamp);
        var cached = await cache.GetRecordAsync<CacheList<CategoryCacheItem>>(cacheKey, ct);
        if (cached is not null)
        {
            var cachedItems = cached.Items.Select(item => item.ToEntity()).ToList();
            return (cachedItems, cached.Total);
        }

        var query = db.Categories.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(normalized))
        {
            query = query.Where(x => x.Name.ToLower().Contains(normalized));
        }

        var total = await query.LongCountAsync(ct);

        var items = await query
            .OrderBy(x => x.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        var cachePayload = new CacheList<CategoryCacheItem>(
            items.Select(CategoryCacheItem.From).ToList(),
            total);

        await cache.SetRecordAsync(cacheKey, cachePayload, CacheOptions, ct);

        return ((IReadOnlyList<Category>)items, total);
    }

    public async Task AddAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
        await BumpStampAsync(ct);
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Update(category);
        await db.SaveChangesAsync(ct);
        await cache.RemoveSafeAsync(GetByIdKey(category.Id), ct);
        await BumpStampAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Categories.Remove(entity);
        await db.SaveChangesAsync(ct);
        await cache.RemoveSafeAsync(GetByIdKey(id), ct);
        await BumpStampAsync(ct);
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLowerInvariant();
        return db.Categories.AsNoTracking().AnyAsync(x => x.Name.ToLower() == normalized, ct);
    }

    private sealed record CacheList<T>(List<T> Items, long Total);

    private sealed record CategoryCacheItem(Guid Id, string Name)
    {
        public static CategoryCacheItem From(Category category)
            => new(category.Id, category.Name);

        public Category ToEntity()
            => Category.Rehydrate(Id, Name);
    }
}
