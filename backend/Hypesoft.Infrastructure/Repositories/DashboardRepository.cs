using Hypesoft.Domain.Repositories;
using Hypesoft.Domain.Entities;
using Hypesoft.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Hypesoft.Infrastructure.Repositories;

public sealed class DashboardRepository(HypesoftDbContext db) : IDashboardRepository
{
    public async Task<DashboardSummarySnapshot> GetSummaryAsync(
        DateTime from,
        DateTime to,
        int lowStockThreshold,
        int lowStockTake,
        int topTake,
        int recentTake,
        CancellationToken ct = default)
    {
        var products = db.Products.AsNoTracking();
        var categories = db.Categories.AsNoTracking();

        var totalProducts = await products.LongCountAsync(ct);
        var stockValue = 0m;
        if (totalProducts > 0)
        {
            stockValue = await products
                .Select(product => product.Price * product.Stock)
                .SumAsync(ct);
        }

        var lowStockCount = await products.CountAsync(product => product.Stock < lowStockThreshold, ct);
        var lowStockItems = await products
            .Where(product => product.Stock < lowStockThreshold)
            .OrderBy(product => product.Stock)
            .Take(lowStockTake)
            .ToListAsync(ct);

        var topProducts = await products
            .OrderByDescending(product => product.Price * product.Stock)
            .Take(topTake)
            .ToListAsync(ct);

        var recentProducts = await products
            .OrderByDescending(product => product.CreatedAt)
            .Take(recentTake)
            .ToListAsync(ct);

        var categorySnapshots = await categories
            .Select(category => new CategorySnapshot(category.Id, category.Name))
            .ToListAsync(ct);
        var categoryNames = categorySnapshots.ToDictionary(category => category.Id, category => category.Name);
        var categoryCountSeed = await products
            .Select(product => product.CategoryId)
            .ToListAsync(ct);

        var allProducts = await products
            .OrderBy(product => product.Name)
            .ToListAsync(ct);

        var categoryCounts = categoryCountSeed
            .GroupBy(categoryId => categoryId)
            .Select(group => new CategoryCountSnapshot(
                group.Key,
                categoryNames.TryGetValue(group.Key, out var name) ? name : "Sem categoria",
                group.Count()))
            .ToList();

        var endExclusive = to.Date.AddDays(1);
        var trendSeed = await products
            .Where(product => product.CreatedAt >= from.Date && product.CreatedAt < endExclusive)
            .Select(product => new { product.CreatedAt, product.Price, product.Stock })
            .ToListAsync(ct);

        var trendLookup = trendSeed
            .GroupBy(product => product.CreatedAt.Date)
            .ToDictionary(
                group => group.Key,
                group => group.Sum(item => item.Price * item.Stock));

        var trend = new List<DashboardTrendPointSnapshot>();
        for (var day = from.Date; day <= to.Date; day = day.AddDays(1))
        {
            trendLookup.TryGetValue(day, out var value);
            trend.Add(new DashboardTrendPointSnapshot(day, value));
        }

        return new DashboardSummarySnapshot(
            totalProducts,
            stockValue,
            lowStockCount,
            lowStockItems,
            topProducts,
            recentProducts,
            allProducts,
            categorySnapshots,
            categoryCounts,
            trend);
    }
}
