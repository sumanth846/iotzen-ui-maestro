import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyPaymentModalComponent } from './verify-payment-modal.component';

describe('VerifyPaymentModalComponent', () => {
  let component: VerifyPaymentModalComponent;
  let fixture: ComponentFixture<VerifyPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifyPaymentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VerifyPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
