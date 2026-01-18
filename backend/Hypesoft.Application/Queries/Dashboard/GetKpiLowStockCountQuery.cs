using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public sealed record GetKpiLowStockCountQuery(int Threshold = 10) : IRequest<int>;
