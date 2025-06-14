import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function identicalValueValidator(firstInputName: string, secondInputName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    var firstInput = group.get(firstInputName);
    var secondInput = group.get(secondInputName);
    return firstInput && secondInput && firstInput.value === secondInput.value ? null : {nonidenticalValue: true}
  };
}

export const nonidenticalValueErrorKey = "nonidenticalValue";
