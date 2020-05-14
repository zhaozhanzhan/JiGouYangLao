import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationRegistrationAddComponent } from './rehabilitationRegistrationAdd.component';

describe('GoodsAddEditComponent', () => {
  let component: RehabilitationRegistrationAddComponent;
  let fixture: ComponentFixture<RehabilitationRegistrationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationRegistrationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationRegistrationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
