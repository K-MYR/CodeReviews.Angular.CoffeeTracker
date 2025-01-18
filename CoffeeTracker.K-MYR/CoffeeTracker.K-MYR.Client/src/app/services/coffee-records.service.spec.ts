import { TestBed } from '@angular/core/testing';

import { CoffeeRecordsService } from './coffee-records.service';

describe('CoffeeRecordsService', () => {
  let service: CoffeeRecordsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffeeRecordsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
