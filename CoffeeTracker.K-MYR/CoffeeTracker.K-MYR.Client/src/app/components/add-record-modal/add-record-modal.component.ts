import { PostCoffeeRecord, PostCoffeeRecordForm } from '../../interfaces/post-coffee-record';
import { ModalComponent } from '../modal/modal.component';


import { Component, output, OutputEmitterRef, } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-record-modal',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './add-record-modal.component.html',
  styleUrl: './add-record-modal.component.scss'
})
export class AddRecordModalComponent extends ModalComponent {
  recordForm = new FormGroup<PostCoffeeRecordForm>({
    type: new FormControl<string|null>(null, [
      Validators.required,
    ]),
    dateTime: new FormControl<string|null>(null, [
      Validators.required,
    ])
  });
  submitCoffeeRecord: OutputEmitterRef<PostCoffeeRecord> = output<PostCoffeeRecord>();

  populate(coffeeType: string, dateTime: Date) {
    this.recordForm.setValue({
      type: coffeeType,
      dateTime: dateTime.toISOString().slice(0, -2)
    });
  }

  onSubmit() : void {
    if (this.recordForm.valid) {
      this.close();
      let data = this.recordForm.value;
      if (data.type && data.dateTime) {
        this.submitCoffeeRecord.emit({
          type: data.type,
          dateTime: data.dateTime
        });
      }
      this.recordForm.reset();
    }
  }
}
