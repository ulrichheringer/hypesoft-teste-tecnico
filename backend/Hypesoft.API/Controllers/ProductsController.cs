using Hypesoft.Application.Commands.Products;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Queries.Products;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Hypesoft.API.Controllers;

[ApiController]
[Route("api/products")]
[Authorize(Policy = "User")]
public sealed class ProductsController(IMediator mediator) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PagedProductsResponse>> List(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] string? categoryId = null,
        CancellationToken ct = default)
    {
        var normalizedSearch = string.IsNullOrWhiteSpace(search)
            || string.Equals(search, "null", StringComparison.OrdinalIgnoreCase)
            ? null
            : search.Trim();

        Guid? parsedCategoryId = null;

        if (!string.IsNullOrWhiteSpace(categoryId)
            && !string.Equals(categoryId, "null", StringComparison.OrdinalIgnoreCase))
        {
            if (!Guid.TryParse(categoryId, out var categoryGuid))
                return BadRequest("categoryId invalido.");

            parsedCategoryId = categoryGuid;
        }

        return Ok(await mediator.Send(new ListProductsQuery(page, pageSize, normalizedSearch, parsedCategoryId), ct));
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> GetById([FromRoute] Guid id, CancellationToken ct)
    {
        var product = await mediator.Send(new GetProductByIdQuery(id), ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPost]
    [Authorize(Policy = "Admin")]
    public async Task<ActionResult<ProductDto>> Create([FromBody] CreateProductRequest request, CancellationToken ct)
        => Ok(await mediator.Send(new CreateProductCommand(request), ct));

    [HttpPut("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<ActionResult<ProductDto>> Update(
        [FromRoute] Guid id,
        [FromBody] UpdateProductRequest request,
        CancellationToken ct)
    {
        var product = await mediator.Send(new UpdateProductCommand(id, request), ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpPatch("{id:guid}/stock")]
    [Authorize(Policy = "Admin")]
    public async Task<ActionResult<ProductDto>> UpdateStock(
        [FromRoute] Guid id,
        [FromBody] UpdateProductStockRequest request,
        CancellationToken ct)
    {
        var product = await mediator.Send(new UpdateProductStockCommand(id, request), ct);
        return product is null ? NotFound() : Ok(product);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct)
    {
        var deleted = await mediator.Send(new DeleteProductCommand(id), ct);
        return deleted ? NoContent() : NotFound();
    }
}
