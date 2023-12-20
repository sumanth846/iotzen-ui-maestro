import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderCardComponentComponent } from './order-card-component.component';

describe('OrderCardComponentComponent', () => {
  let component: OrderCardComponentComponent;
  let fixture: ComponentFixture<OrderCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderCardComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OrderCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
