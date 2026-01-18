using Hypesoft.Application.DTOs;
using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public sealed record GetKpiCategoryChartQuery : IRequest<IReadOnlyList<CategoryChartItemDto>>;
