import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRecordModalComponent } from './delete-record-modal.component';

describe('DeleteRecordModalComponent', () => {
  let component: DeleteRecordModalComponent;
  let fixture: ComponentFixture<DeleteRecordModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteRecordModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRecordModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
