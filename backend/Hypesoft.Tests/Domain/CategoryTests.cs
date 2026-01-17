using FluentAssertions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Tests.Domain;

public class CategoryTests
{
    [Fact]
    public void Rename_ShouldUpdateName()
    {
        var category = new Category("Old");

        category.Rename("New");

        category.Name.Should().Be("New");
    }

    [Fact]
    public void Constructor_ShouldTrimName()
    {
        var category = new Category("  Accessories  ");

        category.Name.Should().Be("Accessories");
    }

    [Fact]
    public void Rename_ShouldThrow_WhenNameIsEmpty()
    {
        var category = new Category("Valid");

        Action act = () => category.Rename(" ");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Rehydrate_ShouldRestoreValues()
    {
        var id = Guid.NewGuid();

        var category = Category.Rehydrate(id, "Restored");

        category.Id.Should().Be(id);
        category.Name.Should().Be("Restored");
    }
}
