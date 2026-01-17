using FluentAssertions;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Application.Queries.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class GetCategoryByIdHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnNull_WhenNotFound()
    {
        var categories = new CategoryRepositoryStub { Category = null };
        var mapper = TestMapper.Create();
        var handler = new GetCategoryByIdHandler(categories, mapper);

        var result = await handler.Handle(new GetCategoryByIdQuery(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldReturnDto_WhenFound()
    {
        var category = new Category("Books");
        var categories = new CategoryRepositoryStub { Category = category };
        var mapper = TestMapper.Create();
        var handler = new GetCategoryByIdHandler(categories, mapper);

        var result = await handler.Handle(new GetCategoryByIdQuery(category.Id), CancellationToken.None);

        result.Should().NotBeNull();
        result!.Id.Should().Be(category.Id);
    }
}
