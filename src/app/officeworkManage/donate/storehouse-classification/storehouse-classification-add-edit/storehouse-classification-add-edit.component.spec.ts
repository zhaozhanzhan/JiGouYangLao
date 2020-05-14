import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorehouseClassificationAddEditComponent } from './storehouse-classification-add-edit.component';

describe('StorehouseClassificationAddEditComponent', () => {
  let component: StorehouseClassificationAddEditComponent;
  let fixture: ComponentFixture<StorehouseClassificationAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorehouseClassificationAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorehouseClassificationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
