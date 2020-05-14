import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonInitialComponent } from './rehabilitation-person-initial.component';

describe('RehabilitationPersonInitialComponent', () => {
  let component: RehabilitationPersonInitialComponent;
  let fixture: ComponentFixture<RehabilitationPersonInitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonInitialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonInitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
