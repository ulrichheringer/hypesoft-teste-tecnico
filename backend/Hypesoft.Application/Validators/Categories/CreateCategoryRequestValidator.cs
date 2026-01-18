using FluentValidation;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Validators.Categories;

public sealed class CreateCategoryRequestValidator : AbstractValidator<CreateCategoryRequest>
{
    public CreateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(80).WithMessage("O nome deve conter no máximo 80 caracteres.");
    }
}