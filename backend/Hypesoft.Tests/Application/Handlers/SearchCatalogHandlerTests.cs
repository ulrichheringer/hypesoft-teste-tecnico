using FluentAssertions;
using Hypesoft.Application.Handlers.Search;
using Hypesoft.Application.Queries.Search;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class SearchCatalogHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnEmpty_WhenTermIsBlank()
    {
        var products = new ProductRepositoryStub();
        var categories = new CategoryRepositoryStub();
        var mapper = TestMapper.Create();
        var handler = new SearchCatalogHandler(products, categories, mapper);

        var result = await handler.Handle(new SearchCatalogQuery(" "), CancellationToken.None);

        result.Products.Should().BeEmpty();
        result.Categories.Should().BeEmpty();
        result.Query.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_ShouldUseDefaultTake_WhenInvalid()
    {
        var product = new Product("Name", "Desc", 12m, 2, Guid.NewGuid());
        var category = new Category("Cat");
        var products = new ProductRepositoryStub
        {
            ListResult = (new[] { product }, 1)
        };
        var categories = new CategoryRepositoryStub
        {
            ListResult = (new[] { category }, 1)
        };
        var mapper = TestMapper.Create();
        var handler = new SearchCatalogHandler(products, categories, mapper);

        var result = await handler.Handle(new SearchCatalogQuery("term", 0), CancellationToken.None);

        result.Products.Should().HaveCount(1);
        result.Categories.Should().HaveCount(1);
        products.ListArgs.Should().NotBeNull();
        products.ListArgs!.Value.Page.Should().Be(1);
        products.ListArgs!.Value.PageSize.Should().Be(5);
    }
}
