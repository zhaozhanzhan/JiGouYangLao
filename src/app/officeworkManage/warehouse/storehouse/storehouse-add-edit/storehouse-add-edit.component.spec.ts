import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorehouseAddEditComponent } from './storehouse-add-edit.component';

describe('StorehouseAddEditComponent', () => {
  let component: StorehouseAddEditComponent;
  let fixture: ComponentFixture<StorehouseAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorehouseAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorehouseAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
