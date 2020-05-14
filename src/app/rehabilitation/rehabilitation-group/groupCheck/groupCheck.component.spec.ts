import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCheckComponent } from './groupCheck.component';

describe('GroupCheckComponent', () => {
  let component: GroupCheckComponent;
  let fixture: ComponentFixture<GroupCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
