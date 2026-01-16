namespace Hypesoft.Application.DTOs;

public sealed record PagedProductsResponse(
    IReadOnlyList<ProductDto> Items,
    long Total,
    int Page,
    int PageSize);
