import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraModuleComponent } from './camera-module.component';

describe('CameraModuleComponent', () => {
  let component: CameraModuleComponent;
  let fixture: ComponentFixture<CameraModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CameraModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CameraModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
