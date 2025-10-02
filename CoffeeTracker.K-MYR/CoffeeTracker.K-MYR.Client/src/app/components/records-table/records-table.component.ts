import { RecordSearchStateService } from '../../services/record-search-state.service';
import { CoffeeRecordsService } from '../../services/coffee-records.service';
import { DataUpdateService } from '../../services/data-update.service';
import { AddRecordModalComponent } from '../add-record-modal/add-record-modal.component';
import { DeleteRecordModalComponent } from '../delete-record-modal/delete-record-modal.component';
import { OrderDirection } from '../../enums/order-direction';
import { CoffeeRecord } from '../../interfaces/coffee-record';
import { PostCoffeeRecord } from '../../interfaces/post-coffee-record';
import { EditRecordModalComponent } from '../edit-record-modal/edit-record-modal.component';
import { Component, output, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { inject } from '@angular/core';
import { LoadingIndicatorComponent, LoadingIndicatorTextPath } from '../shared/loading-indicator/loading-indicator.component';
import { withMessage } from '../../helpers/angular-extensions';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-records-table',
  standalone: true,
  imports: [ DatePipe, AddRecordModalComponent, DeleteRecordModalComponent, EditRecordModalComponent, LoadingIndicatorComponent],
  templateUrl: './records-table.component.html',
  styleUrl: './records-table.component.scss'
})
export class RecordsTableComponent {
  private addRecordModal = viewChild.required<AddRecordModalComponent>('addRecordModal');
  private editRecordModal = viewChild.required<EditRecordModalComponent>('editRecordModal');
  private deleteRecordModal = viewChild.required<DeleteRecordModalComponent>('deleteRecordModal'); 
  private readonly _recordsSearchService = inject(RecordSearchStateService);
  private readonly _coffeeRecordService = inject(CoffeeRecordsService);
  private readonly _dataUpdateService = inject(DataUpdateService);
  private notificationService = inject(NotificationService);
  textPaths: LoadingIndicatorTextPath[] = [
    { text: 'Loading .  .  .', startOffset: 0, id: "t1" },
    { text: 'Loading .  .  .', startOffset: 0.5, id: "t2" },
  ];
  columns: Column[] = [{ title: 'Date & Time', property: 'dateTime' }, { title: 'Type', property: 'type' }];
  records = this._recordsSearchService.records;
  orderBy = this._recordsSearchService.orderBy;
  orderDirection = this._recordsSearchService.orderDirection;
  hasNext = this._recordsSearchService.hasNext;
  hasPrevious = this._recordsSearchService.hasPrevious;
  page = this._recordsSearchService.page;
  isLoading = this._recordsSearchService.isLoading;
  addedRecord = output<PostCoffeeRecord>();

  updateSorting(orderBy: keyof CoffeeRecord, orderDirection: OrderDirection): void {
    if (orderBy !== this.orderBy() || orderDirection !== this.orderDirection()) {
      this._recordsSearchService.updateFilter({
        orderBy: orderBy,
        orderDirection: orderDirection,
      });
    }
  }

  changePage(isPrevious: boolean = false): void {
    this._recordsSearchService.changePage(isPrevious);
  }

  updatePageSize(pageSize: number): void {
    this._recordsSearchService.changePageSize(pageSize);
  }

  openAddRecordModal(): void {    
    this.addRecordModal().open();
  }

  openEditRecordModal(event: Event, record: CoffeeRecord) {
    this.editRecordModal().populate(record);
    this.editRecordModal().open();
  }

  openDeleteRecordModal(event: Event, record: CoffeeRecord) {
    this.deleteRecordModal().populate(record.type, record.id);
    this.deleteRecordModal().open();
  }

  onSubmitCoffeeRecord(record: any) {
    this._coffeeRecordService
      .postCoffeeRecord(record)
      .pipe(
        withMessage(
          this.notificationService,
          "Brewing your coffee...",
          "Coffee entry added successfully!",
          "Grounds for error—brew failed."
        )
      )
      .subscribe(_ =>  this._dataUpdateService.notify()
      );
  }

  onPutCoffeeRecord(record: any) {
    this._coffeeRecordService
      .putCoffeeRecord(record)
      .pipe(
        withMessage(
          this.notificationService,
          "Grinding through your edits...",
          "Brew-tiful! Entry updated successfully.",
          "Grounds for error—edit failed."
        )
      )
      .subscribe(_ => this._dataUpdateService.notify());
  }

  onDeleteCoffeeRecord(id: any) {
    this._coffeeRecordService
      .deleteCoffeeRecord(id)
      .pipe(
        withMessage(
          this.notificationService,
          "Pouring out your entry...",
          "The cup is empty—deletion complete!",
          "Grounds for error—deletion failed."
        )
      )
      .subscribe(_ => this._dataUpdateService.notify()
      );
  } 

  onSelectPageSize(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    const number = Number(selectedValue);
    if (!isNaN(number)) {
      this.updatePageSize(number);
    }
  }  
}

interface Column {
  title: string,
  property: keyof CoffeeRecord
}
