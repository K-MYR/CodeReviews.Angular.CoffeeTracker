import { ModalComponent } from '../shared/modal/modal.component';
import { CoffeeRecord } from '../../interfaces/coffee-record';
import { PutCoffeeRecordForm } from '../../interfaces/put-coffee-record';
import { Component, output, OutputEmitterRef, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-record-modal',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  templateUrl: './edit-record-modal.component.html',
  styleUrl: './edit-record-modal.component.scss'
})
export class EditRecordModalComponent extends ModalComponent {
  recordForm = new FormGroup<PutCoffeeRecordForm>({
    id: new FormControl<number|null>(null, [ Validators.required ]),
    type: new FormControl<string|null>(null, [ Validators.required ]),
    dateTime: new FormControl<string|null>(null, [ Validators.required ])
  });
  putCoffeeRecord: OutputEmitterRef<CoffeeRecord> = output<CoffeeRecord>();
  type = signal<string>("");

  populate(record: CoffeeRecord) {
    this.recordForm.setValue({
      id: record.id,
      type: record.type,
      dateTime: record.dateTime.toISOString().slice(0, -2)
    });
    this.type.set(record.type);
  }

  onSubmit(): void {
    if (this.recordForm.valid) {
      this.close();
      let data = this.recordForm.value;
      if (data.type && data.dateTime && data.id) {
        this.putCoffeeRecord.emit({
          id: data.id,
          type: data.type,
          dateTime: new Date(data.dateTime)
        });
      }
      this.recordForm.reset();
    }
  }
}
