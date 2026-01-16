using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class CategoryRepository(HypesoftDbContext db, IMemoryCache cache) : ICategoryRepository
{
    private const string StampKey = "categories:stamp";
    private static readonly TimeSpan CacheDuration = TimeSpan.FromSeconds(30);

    private static string GetByIdKey(Guid id) => $"categories:by-id:{id}";

    private static string GetListKey(int page, int pageSize, string? search, long stamp)
        => $"categories:list:{page}:{pageSize}:{search}:{stamp}";

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

    public Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => cache.GetOrCreateAsync(GetByIdKey(id), entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;
            return db.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);
        })!;

    public async Task<(IReadOnlyList<Category> Items, long Total)> ListAsync(
        int page,
        int pageSize,
        string? search,
        CancellationToken ct = default)
    {
        var normalized = string.IsNullOrWhiteSpace(search)
            ? null
            : search.Trim().ToLowerInvariant();

        var stamp = GetStamp();
        var cacheKey = GetListKey(page, pageSize, normalized, stamp);

        return await cache.GetOrCreateAsync(cacheKey, async entry =>
        {
            entry.AbsoluteExpirationRelativeToNow = CacheDuration;

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

            return ((IReadOnlyList<Category>)items, total);
        });
    }

    public async Task AddAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
        BumpStamp();
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Update(category);
        await db.SaveChangesAsync(ct);
        cache.Remove(GetByIdKey(category.Id));
        BumpStamp();
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Categories.Remove(entity);
        await db.SaveChangesAsync(ct);
        cache.Remove(GetByIdKey(id));
        BumpStamp();
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLowerInvariant();
        return db.Categories.AsNoTracking().AnyAsync(x => x.Name.ToLower() == normalized, ct);
    }
}
