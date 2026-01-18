using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public sealed record GetKpiStockValueQuery : IRequest<decimal>;
