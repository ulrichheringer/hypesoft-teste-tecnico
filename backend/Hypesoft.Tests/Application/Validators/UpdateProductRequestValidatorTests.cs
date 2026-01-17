using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators.Products;

namespace Hypesoft.Tests.Application.Validators;

public class UpdateProductRequestValidatorTests
{
    [Fact]
    public void Validate_ShouldFail_WhenNameIsEmpty()
    {
        var validator = new UpdateProductRequestValidator();
        var request = new UpdateProductRequest("", "Desc", 10m, 1, Guid.NewGuid());

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_ShouldFail_WhenPriceIsZero()
    {
        var validator = new UpdateProductRequestValidator();
        var request = new UpdateProductRequest("Name", "Desc", 0m, 1, Guid.NewGuid());

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_ShouldPass_WhenInputIsValid()
    {
        var validator = new UpdateProductRequestValidator();
        var request = new UpdateProductRequest("Name", "Desc", 10m, 1, Guid.NewGuid());

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
