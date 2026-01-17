namespace Hypesoft.Application.DTOs;

public sealed record DashboardSummaryDto(
    long TotalProducts,
    decimal StockValue,
    int LowStockCount,
    IReadOnlyList<ProductDto> LowStockItems,
    IReadOnlyList<ProductDto> TopProducts,
    IReadOnlyList<ProductDto> RecentProducts,
    IReadOnlyList<CategoryDto> Categories,
    IReadOnlyList<CategoryChartItemDto> CategoryChart,
    IReadOnlyList<DashboardTrendPointDto> Trend);

public sealed record CategoryChartItemDto(string Label, int Value);

public sealed record DashboardTrendPointDto(string Label, decimal Value, decimal Benchmark);
