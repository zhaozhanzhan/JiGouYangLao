import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InStorehouseComponent } from './in-storehouse.component';

describe('InStorehouseComponent', () => {
  let component: InStorehouseComponent;
  let fixture: ComponentFixture<InStorehouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InStorehouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InStorehouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
