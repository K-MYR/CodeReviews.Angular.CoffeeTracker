import { RecordsTableComponent } from '../records-table/records-table.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { SearchFiltersComponent } from '../search-filters/search-filters.component';

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RecordsTableComponent, StatisticsComponent, SearchFiltersComponent, ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
}
