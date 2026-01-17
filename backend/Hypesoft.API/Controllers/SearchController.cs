using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Search;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/search")]
[Authorize(Policy = "User")]
public sealed class SearchController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<CatalogSearchResponse>> Search(
        [FromQuery] string? term = null,
        [FromQuery] int take = 5,
        CancellationToken ct = default)
    {
        var query = new SearchCatalogQuery(term ?? string.Empty, take);
        return Ok(await mediator.Send(query, ct));
    }
}
