import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutStorehouseCheckComponent } from './out-storehouse-check.component';

describe('OutStorehouseAddComponent', () => {
  let component: OutStorehouseCheckComponent;
  let fixture: ComponentFixture<OutStorehouseCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutStorehouseCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutStorehouseCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
