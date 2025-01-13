import { CoffeeRecordService } from '../../services/coffee-record.service';
import { AddRecordModalComponent } from '../add-record-modal/add-record-modal.component';
import { OrderDirection } from '../../enums/order-direction';
import { CoffeeRecord } from '../../interfaces/coffee-record';
import { PostCoffeeRecord } from '../../interfaces/post-coffee-record';

import { Component, Signal, viewChild } from '@angular/core';
import { DatePipe, AsyncPipe } from '@angular/common';
import { inject } from '@angular/core';


@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [ DatePipe, AsyncPipe, AddRecordModalComponent],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent {
  private dialog: Signal<AddRecordModalComponent> = viewChild.required<AddRecordModalComponent>('addRecordModal'); 
  private readonly _coffeeRecordService = inject(CoffeeRecordService);
  columns: Column[] = [{ title: 'Id', property: 'id' }, { title: 'Date & Time', property: 'dateTime' }, { title: 'Type', property: 'type' }];
  records = this._coffeeRecordService.records;
  orderBy = this._coffeeRecordService.orderBy;
  orderDirection = this._coffeeRecordService.orderDirection;
  page = this._coffeeRecordService.page
  hasNext = this._coffeeRecordService.hasNext;
  hasPrevious = this._coffeeRecordService.hasPrevious;

  openAddRecordModal(): void {
    this.dialog().open();
  }

  updateSorting(orderBy: keyof CoffeeRecord, orderDirection: OrderDirection): void {
    if (orderBy !== this.orderBy() || orderDirection !== this.orderDirection()) {
      this._coffeeRecordService.updateFilter({
        orderBy: orderBy,
        orderDirection: orderDirection
      });
    }
  }

  onSubmitCoffeeRecord(record: PostCoffeeRecord) {
    this._coffeeRecordService.postCoffeeRecord(record)
      .subscribe(_ => {
        this._coffeeRecordService.reload();
      });
  }
}

interface Column {
  title: string,
  property: keyof CoffeeRecord
}
