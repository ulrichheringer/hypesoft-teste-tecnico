using MediatR;

namespace Hypesoft.Application.Commands.Products;

public sealed record DeleteProductCommand(Guid Id) : IRequest<bool>;
