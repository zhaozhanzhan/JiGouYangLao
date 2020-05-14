import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InStorehouseAddComponent } from './in-storehouse-add.component';

describe('InStorehouseAddComponent', () => {
  let component: InStorehouseAddComponent;
  let fixture: ComponentFixture<InStorehouseAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InStorehouseAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InStorehouseAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
