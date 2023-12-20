import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashModalComponent } from './cash-modal.component';

describe('CashModalComponent', () => {
  let component: CashModalComponent;
  let fixture: ComponentFixture<CashModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CashModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CashModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
