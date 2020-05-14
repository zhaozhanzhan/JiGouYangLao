import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsAddEditComponent } from './goods-add-edit.component';

describe('GoodsAddEditComponent', () => {
  let component: GoodsAddEditComponent;
  let fixture: ComponentFixture<GoodsAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
