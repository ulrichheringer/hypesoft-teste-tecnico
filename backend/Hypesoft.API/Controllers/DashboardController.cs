using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize(Policy = "User")]
public sealed class DashboardController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<DashboardSummaryDto>> GetSummary(CancellationToken ct)
        => Ok(await mediator.Send(new GetDashboardSummaryQuery(), ct));

    [HttpGet("kpi/total-products")]
    public async Task<ActionResult<long>> GetTotalProducts(CancellationToken ct)
        => Ok(await mediator.Send(new GetKpiTotalProductsQuery(), ct));

    [HttpGet("kpi/stock-value")]
    public async Task<ActionResult<decimal>> GetStockValue(CancellationToken ct)
        => Ok(await mediator.Send(new GetKpiStockValueQuery(), ct));

    [HttpGet("kpi/low-stock-count")]
    public async Task<ActionResult<int>> GetLowStockCount(
        [FromQuery] int threshold = 10,
        CancellationToken ct = default)
        => Ok(await mediator.Send(new GetKpiLowStockCountQuery(threshold), ct));

    [HttpGet("kpi/category-chart")]
    public async Task<ActionResult<IReadOnlyList<CategoryChartItemDto>>> GetCategoryChart(CancellationToken ct)
        => Ok(await mediator.Send(new GetKpiCategoryChartQuery(), ct));
}
