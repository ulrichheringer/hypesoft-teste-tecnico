using FluentAssertions;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class ListCategoriesHandlerTests
{
    [Fact]
    public async Task Handle_ShouldNormalizePagingAndSearch()
    {
        var categories = new CategoryRepositoryStub();
        var mapper = TestMapper.Create();
        var handler = new ListCategoriesHandler(categories, mapper);
        var query = new ListCategoriesQuery(0, -5, "  tech  ");

        var result = await handler.Handle(query, CancellationToken.None);

        categories.ListArgs.Should().NotBeNull();
        categories.ListArgs!.Value.Page.Should().Be(1);
        categories.ListArgs!.Value.PageSize.Should().Be(50);
        categories.ListArgs!.Value.Search.Should().Be("tech");
        result.Total.Should().Be(0);
    }
}
