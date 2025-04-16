import { Component, output, OutputEmitterRef } from '@angular/core';
import { ModalComponent } from '../shared/modal/modal.component';

@Component({
  selector: 'app-delete-record-modal',
  standalone: true,
  templateUrl: './delete-record-modal.component.html',
  styleUrl: './delete-record-modal.component.scss'
})
export class DeleteRecordModalComponent extends ModalComponent {
  deleteCoffeeRecord: OutputEmitterRef<number> = output<number>();
  record?: string = "";
  id?: number;

  populate(recordType: string, id: number): void {
    this.record = recordType;
    this.id = id;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.close();
    if (this.id) {
      this.deleteCoffeeRecord.emit(this.id);    
    }
  }
}
