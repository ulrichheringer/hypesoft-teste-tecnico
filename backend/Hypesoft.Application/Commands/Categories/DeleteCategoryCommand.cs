using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public sealed record DeleteCategoryCommand(Guid Id) : IRequest<bool>;
