import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsStockComponent } from './goods-stock.component';

describe('GoodsStockComponent', () => {
  let component: GoodsStockComponent;
  let fixture: ComponentFixture<GoodsStockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsStockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
