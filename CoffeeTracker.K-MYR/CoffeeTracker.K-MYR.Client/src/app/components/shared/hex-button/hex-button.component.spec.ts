import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HexButtonComponent } from './hex-button.component';

describe('HexButtonComponent', () => {
  let component: HexButtonComponent;
  let fixture: ComponentFixture<HexButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HexButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HexButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
