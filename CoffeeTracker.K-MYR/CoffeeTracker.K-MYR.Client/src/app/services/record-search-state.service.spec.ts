import { TestBed } from '@angular/core/testing';
import { RecordSearchStateService } from './record-search-state.service';

describe('CoffeeRecordService', () => {
  let service: RecordSearchStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecordSearchStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
