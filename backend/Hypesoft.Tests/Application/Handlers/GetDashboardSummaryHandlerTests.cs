using FluentAssertions;
using Hypesoft.Application.Handlers.Dashboard;
using Hypesoft.Application.Interfaces;
using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class GetDashboardSummaryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldMapSummaryData()
    {
        var categoryId = Guid.NewGuid();
        var product = new Product("Name", "Desc", 10m, 2, categoryId);
        var startDate = DateTime.UtcNow.Date.AddDays(-1);
        var snapshot = new DashboardSummarySnapshot(
            1,
            20m,
            1,
            new[] { product },
            new[] { product },
            new[] { product },
            new[] { new CategorySnapshot(categoryId, "Cat") },
            new[] { new CategoryCountSnapshot(categoryId, "Cat", 1) },
            new[]
            {
                new DashboardTrendPointSnapshot(startDate, 10m),
                new DashboardTrendPointSnapshot(startDate.AddDays(1), 30m)
            });

        var repository = new DashboardRepositoryStub(snapshot);
        var mapper = TestMapper.Create();
        var handler = new GetDashboardSummaryHandler(repository, mapper);

        var result = await handler.Handle(new GetDashboardSummaryQuery(), CancellationToken.None);

        result.TotalProducts.Should().Be(1);
        result.LowStockItems.Should().HaveCount(1);
        result.LowStockItems[0].Id.Should().Be(product.Id);
        result.Categories.Should().ContainSingle(category => category.Id == categoryId);
        result.CategoryChart.Should().ContainSingle(item => item.Label == "Cat" && item.Value == 1);
        result.Trend.Should().HaveCount(2);
        result.Trend[0].Benchmark.Should().Be(20m);
    }

    private sealed class DashboardRepositoryStub(DashboardSummarySnapshot snapshot) : IDashboardRepository
    {
        public Task<DashboardSummarySnapshot> GetSummaryAsync(
            DateTime from,
            DateTime to,
            int lowStockThreshold,
            int lowStockTake,
            int topTake,
            int recentTake,
            CancellationToken ct = default)
            => Task.FromResult(snapshot);
    }
}
