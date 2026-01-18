using Hypesoft.Application.DTOs;
using Hypesoft.Domain.Repositories;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using AutoMapper;

namespace Hypesoft.Application.Handlers.Dashboard;

public sealed class GetDashboardSummaryHandler(IDashboardRepository dashboard, IMapper mapper)
    : IRequestHandler<GetDashboardSummaryQuery, DashboardSummaryDto>
{
    private const int LowStockThreshold = 10;
    private const int LowStockTake = 4;
    private const int TopTake = 4;
    private const int RecentTake = 6;
    private const int TrendDays = 7;

    public async Task<DashboardSummaryDto> Handle(GetDashboardSummaryQuery request, CancellationToken ct)
    {
        var endDate = DateTime.UtcNow.Date;
        var startDate = endDate.AddDays(-(TrendDays - 1));

        var summary = await dashboard.GetSummaryAsync(
            startDate,
            endDate,
            LowStockThreshold,
            LowStockTake,
            TopTake,
            RecentTake,
            ct);

        var averageValue = summary.Trend.Count > 0
            ? summary.Trend.Average(point => point.Value)
            : 0m;

        var trend = summary.Trend
            .Select(point => new DashboardTrendPointDto(
                point.Date.ToString("dd/MM"),
                point.Value,
                averageValue))
            .ToList();

        return new DashboardSummaryDto(
            summary.TotalProducts,
            summary.StockValue,
            summary.LowStockCount,
            summary.LowStockItems.Select(mapper.Map<ProductDto>).ToList(),
            summary.TopProducts.Select(mapper.Map<ProductDto>).ToList(),
            summary.RecentProducts.Select(mapper.Map<ProductDto>).ToList(),
            summary.AllProducts.Select(mapper.Map<ProductDto>).ToList(),
            summary.Categories.Select(mapper.Map<CategoryDto>).ToList(),
            summary.CategoryCounts
                .OrderByDescending(item => item.Count)
                .Select(item => new CategoryChartItemDto(item.CategoryName, item.Count))
                .ToList(),
            trend);
    }
}
