import { RecordsSearchForm } from '../../interfaces/records-search';
import { RecordSearchStateService } from '../../services/record-search-state.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filters',
  standalone: true,
  imports: [ ReactiveFormsModule,],
  templateUrl: './search-filters.component.html',
  styleUrl: './search-filters.component.scss'
})
export class SearchFiltersComponent {
  filtersForm = new FormGroup<RecordsSearchForm>({
    type: new FormControl<string|null>(null),
    dateTimeFrom: new FormControl<string|null>(null),
    dateTimeTo: new FormControl<string|null>(null),
  });
  private _recordsSearchService = inject(RecordSearchStateService);

  resetFilters(): void {
    this.filtersForm.reset();
    this.updateFilters();
  }

  onSubmit(): void {
    this.updateFilters();
  }    

  updateFilters(): void {
    var data = this.filtersForm.value;
    var dateTimeFrom = data.dateTimeFrom === "" ? null : data.dateTimeFrom;
    var dateTimeTo = data.dateTimeTo === "" ? null : data.dateTimeTo;
    this._recordsSearchService.updateFilter({
      type: data.type ?? undefined,
      dateTimeFrom: dateTimeFrom ?? undefined,
      dateTimeTo: dateTimeTo ?? undefined
    });  
  }
}
