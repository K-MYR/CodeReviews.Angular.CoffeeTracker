import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function identicalValueValidator<T>(firstInputName: keyof T & string, secondInputName: keyof T & string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const firstInput = group.get(firstInputName);
    const secondInput = group.get(secondInputName);
    return firstInput && secondInput && firstInput.value === secondInput.value ? null : {nonidenticalValue: true}
  };
}

export const NONIDENTICAL_VALUE_ERROR_KEY = "nonidenticalValue";
