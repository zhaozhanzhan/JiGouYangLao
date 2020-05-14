import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorehouseClassificationComponent } from './storehouse-classification.component';

describe('StorehouseClassificationComponent', () => {
  let component: StorehouseClassificationComponent;
  let fixture: ComponentFixture<StorehouseClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorehouseClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorehouseClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
