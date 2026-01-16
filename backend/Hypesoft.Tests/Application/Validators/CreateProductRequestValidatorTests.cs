using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators.Products;

namespace Hypesoft.Tests.Application.Validators;

public class CreateProductRequestValidatorTests
{
    [Fact]
    public void Validate_ShouldReturnErrors_WhenRequestIsInvalid()
    {
        var validator = new CreateProductRequestValidator();
        var request = new CreateProductRequest("", "", 0m, -1, Guid.Empty);

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Select(e => e.PropertyName)
            .Should().Contain(new[] { "Name", "Description", "Price", "Stock", "CategoryId" });
    }

    [Fact]
    public void Validate_ShouldPass_WhenRequestIsValid()
    {
        var validator = new CreateProductRequestValidator();
        var request = new CreateProductRequest("Notebook", "Gaming", 5000m, 3, Guid.NewGuid());

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
