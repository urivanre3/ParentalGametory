import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarjuegoComponent } from './agregarjuego.component';

describe('AgregarjuegoComponent', () => {
  let component: AgregarjuegoComponent;
  let fixture: ComponentFixture<AgregarjuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarjuegoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarjuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
