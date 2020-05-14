import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoodsClassificationComponent } from './goods-classification.component';

describe('GoodsClassificationComponent', () => {
  let component: GoodsClassificationComponent;
  let fixture: ComponentFixture<GoodsClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoodsClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoodsClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
