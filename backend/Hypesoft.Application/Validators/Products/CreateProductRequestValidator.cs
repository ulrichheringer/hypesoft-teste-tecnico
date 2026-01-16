using FluentValidation;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Validators.Products;

public sealed class CreateProductRequestValidator : AbstractValidator<CreateProductRequest>
{
    public CreateProductRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome e obrigatorio.")
            .MaximumLength(120).WithMessage("O nome deve conter no maximo 120 caracteres.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("A descricao e obrigatoria.")
            .MaximumLength(500).WithMessage("A descricao deve conter no maximo 500 caracteres.");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("O preco deve ser maior que zero.");

        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0).WithMessage("O estoque nao pode ser negativo.");

        RuleFor(x => x.CategoryId)
            .NotEmpty().WithMessage("A categoria e obrigatoria.");
    }
}
