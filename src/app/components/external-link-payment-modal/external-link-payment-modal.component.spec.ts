import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalLinkPaymentModalComponent } from './external-link-payment-modal.component';

describe('ExternalLinkPaymentModalComponent', () => {
  let component: ExternalLinkPaymentModalComponent;
  let fixture: ComponentFixture<ExternalLinkPaymentModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalLinkPaymentModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExternalLinkPaymentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
