import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaestroPageComponent } from './maestro-page.component';

describe('MaestroPageComponent', () => {
  let component: MaestroPageComponent;
  let fixture: ComponentFixture<MaestroPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaestroPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaestroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
