using FluentAssertions;
using Hypesoft.Application.DTOs;
using Hypesoft.Application.Validators.Products;

namespace Hypesoft.Tests.Application.Validators;

public class UpdateProductStockRequestValidatorTests
{
    [Fact]
    public void Validate_ShouldFail_WhenStockNegative()
    {
        var validator = new UpdateProductStockRequestValidator();
        var request = new UpdateProductStockRequest(-1);

        var result = validator.Validate(request);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Validate_ShouldPass_WhenStockNonNegative()
    {
        var validator = new UpdateProductStockRequestValidator();
        var request = new UpdateProductStockRequest(0);

        var result = validator.Validate(request);

        result.IsValid.Should().BeTrue();
    }
}
