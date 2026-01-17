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
}
