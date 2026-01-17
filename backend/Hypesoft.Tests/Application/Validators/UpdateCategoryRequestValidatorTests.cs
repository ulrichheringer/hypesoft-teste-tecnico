using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators.Categories;

namespace Hypesoft.Tests.Application.Validators;

public class UpdateCategoryRequestValidatorTests
{
    [Fact]
    public void Validate_ShouldFail_WhenNameIsEmpty()
    {
        var validator = new UpdateCategoryRequestValidator();
        var request = new UpdateCategoryRequest("");

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_ShouldFail_WhenNameTooLong()
    {
        var validator = new UpdateCategoryRequestValidator();
        var request = new UpdateCategoryRequest(new string('a', 81));

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_ShouldPass_WhenNameIsValid()
    {
        var validator = new UpdateCategoryRequestValidator();
        var request = new UpdateCategoryRequest("Office");

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
