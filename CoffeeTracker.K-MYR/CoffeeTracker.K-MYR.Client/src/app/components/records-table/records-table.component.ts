import { RecordSearchStateService } from '../../services/record-search-state.service';
import { CoffeeRecordsService } from '../../services/coffee-records.service';
import { DataUpdateService } from '../../services/data-update.service';
import { AddRecordModalComponent } from '../add-record-modal/add-record-modal.component';
import { OrderDirection } from '../../enums/order-direction';
import { CoffeeRecord } from '../../interfaces/coffee-record';
import { PostCoffeeRecord } from '../../interfaces/post-coffee-record';

import { Component, output, viewChild } from '@angular/core';
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
  private dialog = viewChild.required<AddRecordModalComponent>('addRecordModal'); 
  private readonly _recordsSearchService = inject(RecordSearchStateService);
  private readonly _coffeeRecordService = inject(CoffeeRecordsService);
  private readonly _dataUpdateService = inject(DataUpdateService);
  columns: Column[] = [{ title: 'Date & Time', property: 'dateTime' }, { title: 'Type', property: 'type' }];
  records = this._recordsSearchService.records;
  orderBy = this._recordsSearchService.orderBy;
  orderDirection = this._recordsSearchService.orderDirection;
  hasNext = this._recordsSearchService.hasNext;
  hasPrevious = this._recordsSearchService.hasPrevious;
  page = this._recordsSearchService.page;
  isLoading = this._recordsSearchService.isLoading;
  addedRecord = output<PostCoffeeRecord>();

  openAddRecordModal(): void {
    this.dialog().open();
  }  

  updateSorting(orderBy: keyof CoffeeRecord, orderDirection: OrderDirection): void {
    if (orderBy !== this.orderBy() || orderDirection !== this.orderDirection()) {
      this._recordsSearchService.updateFilter({
        orderBy: orderBy,
        orderDirection: orderDirection,
        lastId: undefined,
        lastValue: undefined,
        isPrevious: false,
      });
    }
  }

  onSubmitCoffeeRecord(record: any) {
    this._coffeeRecordService.postCoffeeRecord(record)
      .subscribe(_ => {
        this._dataUpdateService.notify();
      });
  }

  previousPage(): void {
    var records = this.records();
    var lastRecord = records[0];
    var orderBy = this.orderBy();
    this._recordsSearchService.updateFilter({
      lastId: lastRecord.id,
      lastValue: lastRecord[orderBy].toString(),
      isPrevious: true
    });
  } 

  nextPage(): void {
    var records = this.records();
    var lastRecord = records[records.length - 1];
    var orderBy = this.orderBy();
    this._recordsSearchService.updateFilter({
      lastId: lastRecord.id,
      lastValue: this.orderBy() == 'id' ? undefined : lastRecord[orderBy].toString(),
      isPrevious: false,
    })
  }
}

interface Column {
  title: string,
  property: keyof CoffeeRecord
}
