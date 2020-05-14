import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationPersonCheckComponent } from './rehabilitationPersonCheck.component';

describe('RehabilitationPersonCheckComponent', () => {
  let component: RehabilitationPersonCheckComponent;
  let fixture: ComponentFixture<RehabilitationPersonCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationPersonCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationPersonCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
