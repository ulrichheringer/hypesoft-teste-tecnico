using Hypesoft.API.Reports;
using Hypesoft.Application.Queries.Dashboard;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using QuestPDF.Fluent;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/reports")]
[Authorize(Policy = "User")]
public sealed class ReportsController(IMediator mediator) : ControllerBase
{
    [HttpGet("inventory")]
    public async Task<IActionResult> ExportInventoryReport(CancellationToken ct)
    {
        var summary = await mediator.Send(new GetDashboardSummaryQuery(), ct);
        var document = new InventoryReportDocument(summary);
        var content = document.GeneratePdf();

        var fileName = $"relatorio-estoque-{DateTime.UtcNow:yyyyMMdd}.pdf";
        return File(content, "application/pdf", fileName);
    }
}
