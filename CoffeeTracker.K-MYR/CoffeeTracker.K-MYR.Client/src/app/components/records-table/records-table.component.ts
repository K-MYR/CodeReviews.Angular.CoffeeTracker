import { CoffeeRecord } from '../../interfaces/coffee-record';
import { AddRecordModalComponent } from '../add-record-modal/add-record-modal.component';

import { Component, Signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [ DatePipe, AddRecordModalComponent],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent {
  private dialog: Signal<AddRecordModalComponent> = viewChild.required<AddRecordModalComponent>('addRecordModal');
  private _currentColumn: keyof CoffeeRecord = 'id';
  records: CoffeeRecord[] = [
    { id: 1, dateTime: new Date('2024-11-17 09:00:00'), type: 'Iced Coffee' },
    { id: 5, dateTime: new Date('2024-11-19 09:00:00'), type: 'Espresso' },
    { id: 6, dateTime: new Date('2024-11-28 09:00:00'), type: 'Cappucino' },
    { id: 7, dateTime: new Date('2024-12-01 09:00:00'), type: 'Iced Coffee' },
    { id: 2, dateTime: new Date('2024-12-17 09:00:00'), type: 'Espresso' },
    { id: 3, dateTime: new Date('2024-12-18 09:00:00'), type: 'Caffe Latte' },
    { id: 4, dateTime: new Date('2024-12-19 09:00:00'), type: 'Cappucino' },
  ];

  openAddRecordModal(): void {
    this.dialog().open();
  }
}
