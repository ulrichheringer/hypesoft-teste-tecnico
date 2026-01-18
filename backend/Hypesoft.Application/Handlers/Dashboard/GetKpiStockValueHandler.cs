using Hypesoft.Application.Queries.Dashboard;
using Hypesoft.Domain.Repositories;
using MediatR;

namespace Hypesoft.Application.Handlers.Dashboard;

public sealed class GetKpiStockValueHandler(IProductRepository products)
    : IRequestHandler<GetKpiStockValueQuery, decimal>
{
    public Task<decimal> Handle(GetKpiStockValueQuery request, CancellationToken ct)
        => products.GetTotalStockValueAsync(ct);
}
