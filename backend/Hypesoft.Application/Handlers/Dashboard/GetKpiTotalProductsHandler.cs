using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public sealed class GetKpiTotalProductsHandler(IProductRepository products)
    : IRequestHandler<GetKpiTotalProductsQuery, long>
{
    public Task<long> Handle(GetKpiTotalProductsQuery request, CancellationToken ct)
        => products.CountAsync(ct);
}
