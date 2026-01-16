using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators.Categories;

namespace Hypesoft.Tests.Application.Validators;

public class CreateCategoryRequestValidatorTests
{
    [Fact]
    public void Validate_ShouldReturnErrors_WhenNameIsEmpty()
    {
        var validator = new CreateCategoryRequestValidator();
        var request = new CreateCategoryRequest("");

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
        result.Errors.Select(e => e.PropertyName)
            .Should().Contain("Name");
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsValid()
    {
        var validator = new CreateCategoryRequestValidator();
        var request = new CreateCategoryRequest("Electronics");

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
