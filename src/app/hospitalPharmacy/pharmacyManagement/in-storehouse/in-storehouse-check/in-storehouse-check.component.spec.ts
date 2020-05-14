import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InStorehouseCheckComponent } from './in-storehouse-check.component';

describe('InStorehouseAddComponent', () => {
  let component: InStorehouseCheckComponent;
  let fixture: ComponentFixture<InStorehouseCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InStorehouseCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InStorehouseCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
