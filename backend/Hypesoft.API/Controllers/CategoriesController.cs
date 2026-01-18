using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Categories;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/categories")]
[Authorize(Policy = "Admin")]
public sealed class CategoriesController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedCategoriesResponse>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? search = null,
        CancellationToken ct = default)
    {
        var normalizedSearch = string.IsNullOrWhiteSpace(search)
            || string.Equals(search, "null", StringComparison.OrdinalIgnoreCase)
            ? null
            : search.Trim();

        return Ok(await mediator.Send(new ListCategoriesQuery(page, pageSize, normalizedSearch), ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<CategoryDto>> GetById([FromRoute] Guid id, CancellationToken ct)
    {
        var category = await mediator.Send(new GetCategoryByIdQuery(id), ct);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpPost]
    [Authorize(Policy = "Admin")]
    public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryRequest request, CancellationToken ct)
        => Ok(await mediator.Send(new CreateCategoryCommand(request), ct));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<ActionResult<CategoryDto>> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateCategoryRequest request,
        CancellationToken ct)
    {
        var category = await mediator.Send(new UpdateCategoryCommand(id, request), ct);
        return category is null ? NotFound() : Ok(category);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        var deleted = await mediator.Send(new DeleteCategoryCommand(id), ct);
        return deleted ? NoContent() : NotFound();
    }
}
