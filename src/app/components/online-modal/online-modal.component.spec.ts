import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineModalComponent } from './online-modal.component';

describe('OnlineModalComponent', () => {
  let component: OnlineModalComponent;
  let fixture: ComponentFixture<OnlineModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnlineModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
