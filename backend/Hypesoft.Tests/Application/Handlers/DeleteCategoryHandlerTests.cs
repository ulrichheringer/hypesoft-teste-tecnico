using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class DeleteCategoryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnFalse_WhenMissing()
    {
        var categories = new CategoryRepositoryStub { Category = null };
        var handler = new DeleteCategoryHandler(categories);

        var result = await handler.Handle(new DeleteCategoryCommand(Guid.NewGuid()), CancellationToken.None);

        result.Should().BeFalse();
    }

    [Fact]
    public async Task Handle_ShouldDelete_WhenFound()
    {
        var category = new Category("Books");
        var categories = new CategoryRepositoryStub { Category = category };
        var handler = new DeleteCategoryHandler(categories);

        var result = await handler.Handle(new DeleteCategoryCommand(category.Id), CancellationToken.None);

        result.Should().BeTrue();
        categories.DeletedId.Should().Be(category.Id);
    }
}
