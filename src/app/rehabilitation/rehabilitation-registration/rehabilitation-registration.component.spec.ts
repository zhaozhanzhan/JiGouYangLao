import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationRegistrationComponent } from './rehabilitation-registration.component';

describe('RehabilitationRegistrationComponent', () => {
  let component: RehabilitationRegistrationComponent;
  let fixture: ComponentFixture<RehabilitationRegistrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationRegistrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
