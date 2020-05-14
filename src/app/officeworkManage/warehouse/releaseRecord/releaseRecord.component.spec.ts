import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseRecordComponent } from './releaseRecord.component';

describe('StorehouseComponent', () => {
  let component: ReleaseRecordComponent;
  let fixture: ComponentFixture<ReleaseRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
