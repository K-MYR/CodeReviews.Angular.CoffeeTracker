using CoffeeTracker.K_MYR.WebApi.Endpoints;
using FluentValidation;

namespace CoffeeTracker.K_MYR.WebApi.RequestValidators;

public class UpdateCoffeeRecordRequestValidator : AbstractValidator<UpdateCoffeeRecordRequest>
{
    public UpdateCoffeeRecordRequestValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty().WithMessage("The 'type' field cannot be empty")
            .MaximumLength(50).WithMessage("The 'type' field must not exceed 50 characters.");
    }
}
