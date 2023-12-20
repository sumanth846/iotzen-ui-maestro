import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionProofComponent } from './transaction-proof.component';

describe('TransactionProofComponent', () => {
  let component: TransactionProofComponent;
  let fixture: ComponentFixture<TransactionProofComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionProofComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransactionProofComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
