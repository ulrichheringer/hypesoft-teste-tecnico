using FluentValidation;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Validators.Products;

public sealed class UpdateProductStockRequestValidator : AbstractValidator<UpdateProductStockRequest>
{
    public UpdateProductStockRequestValidator()
    {
        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("O estoque nao pode ser negativo.");
    }
}
