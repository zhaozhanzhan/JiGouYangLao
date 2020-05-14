import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorehouseComponent } from './out-storehouse.component';

describe('OutStorehouseComponent', () => {
  let component: OutStorehouseComponent;
  let fixture: ComponentFixture<OutStorehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
