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
}
