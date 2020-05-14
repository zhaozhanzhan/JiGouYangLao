import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonComponent } from './rehabilitation-person.component';

describe('RehabilitationPersonComponent', () => {
  let component: RehabilitationPersonComponent;
  let fixture: ComponentFixture<RehabilitationPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
