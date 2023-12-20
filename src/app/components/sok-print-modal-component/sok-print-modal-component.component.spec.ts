import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SokPrintModalComponentComponent } from './sok-print-modal-component.component';

describe('SokPrintModalComponentComponent', () => {
  let component: SokPrintModalComponentComponent;
  let fixture: ComponentFixture<SokPrintModalComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SokPrintModalComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SokPrintModalComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
