import { TestBed } from '@angular/core/testing';

import { CoffeeRecordService } from './coffee-record.service';

describe('CoffeeRecordService', () => {
  let service: CoffeeRecordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoffeeRecordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
