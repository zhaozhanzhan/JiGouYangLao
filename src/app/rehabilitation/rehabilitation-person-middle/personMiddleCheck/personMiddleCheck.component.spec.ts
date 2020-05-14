import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMiddleCheckComponent } from './personMiddleCheck.component';

describe('PersonMiddleCheckComponent', () => {
  let component: PersonMiddleCheckComponent;
  let fixture: ComponentFixture<PersonMiddleCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonMiddleCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonMiddleCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
