import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {
  private dataChanged = new Subject<void>();
  dataChanged$ = this.dataChanged.asObservable();

  notify() {
    this.dataChanged.next();
  }
}
