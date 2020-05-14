import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RehabilitationGroupComponent } from './rehabilitation-group.component';

describe('RehabilitationGroupComponent', () => {
  let component: RehabilitationGroupComponent;
  let fixture: ComponentFixture<RehabilitationGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RehabilitationGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
