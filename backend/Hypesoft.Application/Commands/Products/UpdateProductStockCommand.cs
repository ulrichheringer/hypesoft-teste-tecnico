using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public sealed record UpdateProductStockCommand(Guid Id, UpdateProductStockRequest Request) : IRequest<ProductDto?>;
