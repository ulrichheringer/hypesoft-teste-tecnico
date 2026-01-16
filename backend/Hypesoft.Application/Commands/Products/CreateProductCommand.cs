using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Products;

public sealed record CreateProductCommand(CreateProductRequest Request) : IRequest<ProductDto>;
