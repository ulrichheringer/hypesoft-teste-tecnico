namespace Hypesoft.Application.DTOs;

public sealed record PagedCategoriesResponse(
    IReadOnlyList<CategoryDto> Items,
    long Total,
    int Page,
    int PageSize);
