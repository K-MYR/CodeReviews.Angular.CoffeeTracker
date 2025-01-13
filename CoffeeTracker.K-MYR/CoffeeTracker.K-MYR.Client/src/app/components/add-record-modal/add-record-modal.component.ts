import { PostCoffeeRecord, PostCoffeeRecordForm } from '../../interfaces/post-coffee-record';

import { Component, ElementRef, output, OutputEmitterRef, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  selector: 'app-add-record-modal',
  standalone: true,
  imports: [ ReactiveFormsModule],
  templateUrl: './add-record-modal.component.html',
  styleUrl: './add-record-modal.component.scss'
})
export class AddRecordModalComponent {
  private dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  recordForm = new FormGroup<PostCoffeeRecordForm>({
    type: new FormControl<string|null>(null, [
      Validators.required,
    ]),
    dateTime: new FormControl<string|null>(null, [
      Validators.required,
    ])
  });
  submitCoffeeRecord: OutputEmitterRef<PostCoffeeRecord> = output<PostCoffeeRecord>();

  constructor() { }

  open() : void {
    this.dialog().nativeElement.showModal();
  }

  close(): void {
    this.dialog().nativeElement.close();
  }

  onMouseDown(event: MouseEvent): void {
    if (event.target == this.dialog().nativeElement) {
      this.close();
    };
  }
  onSubmit() : void {
    if (this.recordForm.valid) {
      let data = this.recordForm.value;
      if (data.type && data.dateTime) {
        this.submitCoffeeRecord.emit({
          type: data.type,
          dateTime: data.dateTime
        });
      }
    }
  }
}
