import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonFinalComponent } from './rehabilitation-person-final.component';

describe('RehabilitationPersonFinalComponent', () => {
  let component: RehabilitationPersonFinalComponent;
  let fixture: ComponentFixture<RehabilitationPersonFinalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonFinalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonFinalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
