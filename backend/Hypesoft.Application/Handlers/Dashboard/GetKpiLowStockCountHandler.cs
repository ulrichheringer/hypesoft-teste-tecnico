using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public sealed class GetKpiLowStockCountHandler(IProductRepository products)
    : IRequestHandler<GetKpiLowStockCountQuery, int>
{
    public Task<int> Handle(GetKpiLowStockCountQuery request, CancellationToken ct)
        => products.CountLowStockAsync(request.Threshold, ct);
}
