using FluentValidation;
using Hypesoft.Application.DTOs;

namespace Hypesoft.Application.Validators.Categories;

public sealed class UpdateCategoryRequestValidator : AbstractValidator<UpdateCategoryRequest>
{
    public UpdateCategoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome e obrigatorio.")
            .MaximumLength(80).WithMessage("O nome deve conter no maximo 80 caracteres.");
    }
}
