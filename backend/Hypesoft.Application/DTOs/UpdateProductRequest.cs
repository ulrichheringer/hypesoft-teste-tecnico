namespace Hypesoft.Application.DTOs;

public sealed record UpdateProductRequest(
    string Name,
    string Description,
    decimal Price,
    int Stock,
    Guid CategoryId);
