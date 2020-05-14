import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmaceuticalAdministrationComponent } from './PharmaceuticalAdministration.component';

describe('PharmaceuticalAdministrationComponent', () => {
  let component: PharmaceuticalAdministrationComponent;
  let fixture: ComponentFixture<PharmaceuticalAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmaceuticalAdministrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaceuticalAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
