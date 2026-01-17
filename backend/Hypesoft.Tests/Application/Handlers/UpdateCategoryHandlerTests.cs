using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Tests.Support;

namespace Hypesoft.Tests.Application.Handlers;

public class UpdateCategoryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldReturnNull_WhenCategoryMissing()
    {
        var categories = new CategoryRepositoryStub { Category = null };
        var mapper = TestMapper.Create();
        var handler = new UpdateCategoryHandler(categories, mapper);
        var command = new UpdateCategoryCommand(Guid.NewGuid(), new UpdateCategoryRequest("New"));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().BeNull();
    }

    [Fact]
    public async Task Handle_ShouldThrow_WhenNameExists()
    {
        var category = new Category("Old");
        var categories = new CategoryRepositoryStub { Category = category, Exists = true };
        var mapper = TestMapper.Create();
        var handler = new UpdateCategoryHandler(categories, mapper);
        var command = new UpdateCategoryCommand(category.Id, new UpdateCategoryRequest("New"));

        Func<Task> act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Category name already exists.");
    }

    [Fact]
    public async Task Handle_ShouldUpdate_WhenNameIsAvailable()
    {
        var category = new Category("Old");
        var categories = new CategoryRepositoryStub { Category = category, Exists = false };
        var mapper = TestMapper.Create();
        var handler = new UpdateCategoryHandler(categories, mapper);
        var command = new UpdateCategoryCommand(category.Id, new UpdateCategoryRequest("New"));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Should().NotBeNull();
        result!.Name.Should().Be("New");
        categories.Updated.Should().NotBeNull();
    }
}
