namespace Hypesoft.Application.DTOs;

public sealed record CatalogSearchResponse(
    IReadOnlyList<ProductDto> Products,
    long ProductsTotal,
    IReadOnlyList<CategoryDto> Categories,
    long CategoriesTotal,
    string Query);
