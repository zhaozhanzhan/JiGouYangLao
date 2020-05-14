import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonAddComponent } from './rehabilitationPersonAdd.component';

describe('RehabilitationPersonAddComponent', () => {
  let component: RehabilitationPersonAddComponent;
  let fixture: ComponentFixture<RehabilitationPersonAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
