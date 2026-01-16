using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Commands.Categories;

public sealed record CreateCategoryCommand(CreateCategoryRequest Request) : IRequest<CategoryDto>;