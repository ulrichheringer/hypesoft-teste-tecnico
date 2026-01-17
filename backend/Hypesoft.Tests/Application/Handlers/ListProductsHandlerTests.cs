using FluentAssertions;
using Hypesoft.Application.Handlers.Products;
using Hypesoft.Application.Queries.Products;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class ListProductsHandlerTests
{
    [Fact]
    public async Task Handle_ShouldNormalizePagingAndSearch()
    {
        var repository = new ProductListCaptureRepository();
        var mapper = TestMapper.Create();
        var handler = new ListProductsHandler(repository, mapper);
        var categoryId = Guid.NewGuid();
        var query = new ListProductsQuery(0, -5, "  notebook  ", categoryId);

        var result = await handler.Handle(query, CancellationToken.None);

        repository.Page.Should().Be(1);
        repository.PageSize.Should().Be(20);
        repository.Search.Should().Be("notebook");
        repository.CategoryId.Should().Be(categoryId);
        result.Total.Should().Be(0);
    }

    private sealed class ProductListCaptureRepository : IProductRepository
    {
        public int? Page { get; private set; }
        public int? PageSize { get; private set; }
        public string? Search { get; private set; }
        public Guid? CategoryId { get; private set; }

        public Task<Product?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<(IReadOnlyList<Product> Items, long Total)> ListAsync(
            int page,
            int pageSize,
            string? search,
            Guid? categoryId,
            CancellationToken ct = default)
        {
            Page = page;
            PageSize = pageSize;
            Search = search;
            CategoryId = categoryId;
            return Task.FromResult(((IReadOnlyList<Product>)Array.Empty<Product>(), 0L));
        }

        public Task AddAsync(Product product, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task UpdateAsync(Product product, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<IReadOnlyList<Product>> ListLowStockAsync(int threshold, CancellationToken ct = default)
            => throw new NotImplementedException();
    }
}
