using CoffeeTracker.K_MYR.WebApi.Endpoints;
using FluentValidation;

namespace CoffeeTracker.K_MYR.WebApi.RequestValidators;

public class CreateCoffeeRecordRequestValidator : AbstractValidator<CreateCoffeeRecordRequest>
{
    public CreateCoffeeRecordRequestValidator()
    {
        RuleFor(x => x.Type)
            .NotEmpty()
            .MaximumLength(50).WithMessage("The 'type' field cannot be empty")
            .WithMessage("The 'type' field must not exceed 50 characters.");
    }
}
