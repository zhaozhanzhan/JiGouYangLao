import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorehouseAddComponent } from './out-storehouse-add.component';

describe('OutStorehouseAddComponent', () => {
  let component: OutStorehouseAddComponent;
  let fixture: ComponentFixture<OutStorehouseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorehouseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorehouseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
