import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonMiddleAddComponent } from './personMiddleAdd.component';

describe('GoodsAddEditComponent', () => {
  let component: PersonMiddleAddComponent;
  let fixture: ComponentFixture<PersonMiddleAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonMiddleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonMiddleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
