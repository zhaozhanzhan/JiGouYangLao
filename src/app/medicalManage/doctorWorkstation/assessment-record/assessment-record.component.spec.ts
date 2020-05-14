import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRecordComponent } from './assessment-record.component';

describe('AssessmentRecordComponent', () => {
  let component: AssessmentRecordComponent;
  let fixture: ComponentFixture<AssessmentRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
