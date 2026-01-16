using FluentAssertions;
using Hypesoft.Application.Commands.Categories;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Handlers.Categories;
using Hypesoft.Domain.Entities;
using Hypesoft.Domain.Repositories;

namespace Hypesoft.Tests.Application.Handlers;

public class CreateCategoryHandlerTests
{
    [Fact]
    public async Task Handle_ShouldThrow_WhenNameAlreadyExists()
    {
        var repository = new CategoryRepositoryStub { Exists = true };
        var handler = new CreateCategoryHandler(repository);
        var command = new CreateCategoryCommand(new CreateCategoryRequest("Electronics"));

        Func<Task> act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Category name already exists.");
    }

    [Fact]
    public async Task Handle_ShouldCreateCategory_WhenNameIsUnique()
    {
        var repository = new CategoryRepositoryStub { Exists = false };
        var handler = new CreateCategoryHandler(repository);
        var command = new CreateCategoryCommand(new CreateCategoryRequest("Electronics"));

        var result = await handler.Handle(command, CancellationToken.None);

        result.Name.Should().Be("Electronics");
        repository.Added.Should().NotBeNull();
        repository.Added!.Name.Should().Be("Electronics");
    }

    private sealed class CategoryRepositoryStub : ICategoryRepository
    {
        public bool Exists { get; set; }
        public Category? Added { get; private set; }

        public Task<Category?> GetByIdAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<(IReadOnlyList<Category> Items, long Total)> ListAsync(
            int page,
            int pageSize,
            string? search,
            CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task AddAsync(Category category, CancellationToken ct = default)
        {
            Added = category;
            return Task.CompletedTask;
        }

        public Task UpdateAsync(Category category, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task DeleteAsync(Guid id, CancellationToken ct = default)
            => throw new NotImplementedException();

        public Task<bool> ExistsByNameAsync(string name, CancellationToken ct = default)
            => Task.FromResult(Exists);
    }
}
