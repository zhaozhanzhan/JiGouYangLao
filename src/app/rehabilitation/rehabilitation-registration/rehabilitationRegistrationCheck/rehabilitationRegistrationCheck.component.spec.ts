import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationRegistrationCheckComponent } from './rehabilitationRegistrationCheck.component';

describe('RehabilitationRegistrationCheckComponent', () => {
  let component: RehabilitationRegistrationCheckComponent;
  let fixture: ComponentFixture<RehabilitationRegistrationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationRegistrationCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationRegistrationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
