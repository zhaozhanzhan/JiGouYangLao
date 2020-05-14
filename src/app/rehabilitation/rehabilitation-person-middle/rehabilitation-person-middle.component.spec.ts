import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonMiddleComponent } from './rehabilitation-person-middle.component';

describe('RehabilitationPersonMiddleComponent', () => {
  let component: RehabilitationPersonMiddleComponent;
  let fixture: ComponentFixture<RehabilitationPersonMiddleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonMiddleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonMiddleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
