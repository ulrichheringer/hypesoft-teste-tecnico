namespace Hypesoft.Application.DTOs;

public sealed record CreateProductRequest(
    string Name,
    string Description,
    decimal Price,
    int Stock,
    Guid CategoryId);
