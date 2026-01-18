using MediatR;

namespace Hypesoft.Application.Queries.Dashboard;

public sealed record GetKpiTotalProductsQuery : IRequest<long>;
