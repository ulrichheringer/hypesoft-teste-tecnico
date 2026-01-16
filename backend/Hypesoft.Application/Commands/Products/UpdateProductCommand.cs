using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public sealed record UpdateProductCommand(Guid Id, UpdateProductRequest Request) : IRequest<ProductDto?>;
