using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class CategoryRepository(HypesoftDbContext db) : ICategoryRepository
{
    public Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => db.Categories.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id, ct);

    public async Task<IReadOnlyList<Category>> ListAsync(CancellationToken ct = default)
        => await db.Categories.AsNoTracking().OrderBy(x => x.Name).ToListAsync(ct);

    public async Task AddAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Add(category);
        await db.SaveChangesAsync(ct);
    }

    public async Task UpdateAsync(Category category, CancellationToken ct = default)
    {
        db.Categories.Update(category);
        await db.SaveChangesAsync(ct);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await db.Categories.FirstOrDefaultAsync(x => x.Id == id, ct);
        if (entity is null) return;

        db.Categories.Remove(entity);
        await db.SaveChangesAsync(ct);
    }

    public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
    {
        var normalized = name.Trim().ToLowerInvariant();
        return db.Categories.AsNoTracking().AnyAsync(x => x.Name.ToLower() == normalized, ct);
    }
}