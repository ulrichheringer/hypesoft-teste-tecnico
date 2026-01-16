using FluentAssertions;
using Hypesoft.Domain.Entities;

namespace Hypesoft.Tests.Domain;

public class ProductTests
{
    [Fact]
    public void Update_ShouldChangeAllFields()
    {
        var categoryId = Guid.NewGuid();
        var product = new Product("Old", "Desc", 10m, 5, categoryId);

        var newCategoryId = Guid.NewGuid();
        product.Update("New", "NewDesc", 20m, 7, newCategoryId);

        product.Name.Should().Be("New");
        product.Description.Should().Be("NewDesc");
        product.Price.Should().Be(20m);
        product.Stock.Should().Be(7);
        product.CategoryId.Should().Be(newCategoryId);
    }

    [Fact]
    public void UpdateStock_ShouldChangeStock()
    {
        var product = new Product("Name", "Desc", 10m, 5, Guid.NewGuid());

        product.UpdateStock(12);

        product.Stock.Should().Be(12);
    }

    [Fact]
    public void IsLowStock_ShouldReturnTrueWhenBelowThreshold()
    {
        var product = new Product("Name", "Desc", 10m, 9, Guid.NewGuid());

        product.IsLowStock().Should().BeTrue();
    }

    [Fact]
    public void IsLowStock_ShouldReturnFalseWhenAtOrAboveThreshold()
    {
        var product = new Product("Name", "Desc", 10m, 10, Guid.NewGuid());

        product.IsLowStock().Should().BeFalse();
    }
}
