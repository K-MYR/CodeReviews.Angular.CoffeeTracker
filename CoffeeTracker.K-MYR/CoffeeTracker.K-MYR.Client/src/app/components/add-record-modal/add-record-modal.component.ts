import { Component, ElementRef, Signal, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-record-modal',
  standalone: true,
  imports: [ ReactiveFormsModule, ],
  templateUrl: './add-record-modal.component.html',
  styleUrl: './add-record-modal.component.scss'
})
export class AddRecordModalComponent {
  private dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  recordForm: FormGroup = new FormGroup({
    type: new FormControl(''),
    dateTime: new FormControl('')
  });

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
}
