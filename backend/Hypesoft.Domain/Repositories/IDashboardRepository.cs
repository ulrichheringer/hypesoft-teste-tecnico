namespace Hypesoft.Domain.Repositories;

public interface IDashboardRepository
{
    Task<DashboardSummarySnapshot> GetSummaryAsync(
        DateTime from,
        DateTime to,
        int lowStockThreshold,
        int lowStockTake,
        int topTake,
        int recentTake,
        CancellationToken ct = default);
}

public sealed record DashboardSummarySnapshot(
    long TotalProducts,
    decimal StockValue,
    int LowStockCount,
    IReadOnlyList<Entities.Product> LowStockItems,
    IReadOnlyList<Entities.Product> TopProducts,
    IReadOnlyList<Entities.Product> RecentProducts,
    IReadOnlyList<Entities.Product> AllProducts,
    IReadOnlyList<CategorySnapshot> Categories,
    IReadOnlyList<CategoryCountSnapshot> CategoryCounts,
    IReadOnlyList<DashboardTrendPointSnapshot> Trend);

public sealed record CategorySnapshot(Guid Id, string Name);

public sealed record CategoryCountSnapshot(Guid CategoryId, string CategoryName, int Count);

public sealed record DashboardTrendPointSnapshot(DateTime Date, decimal Value);
