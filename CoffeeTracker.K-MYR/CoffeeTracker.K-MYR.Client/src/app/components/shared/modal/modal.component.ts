import { Component, ElementRef, Signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-base-modal',
  template: '',
  styles: []
})
export abstract class ModalComponent {
  private dialog: Signal<ElementRef<HTMLDialogElement>> = viewChild.required<ElementRef<HTMLDialogElement>>('dialog'); 


  open(): void {
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

