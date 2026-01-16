using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Categories;

public sealed record ListCategoriesQuery() : IRequest<IReadOnlyList<CategoryDto>>;