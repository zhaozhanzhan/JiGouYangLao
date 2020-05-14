import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaceuticalAdministrationCheckComponent } from './pharmaceuticalAdministration-check.component';


describe('PharmaceuticalAdministrationCheckComponent', () => {
  let component: PharmaceuticalAdministrationCheckComponent;
  let fixture: ComponentFixture<PharmaceuticalAdministrationCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmaceuticalAdministrationCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaceuticalAdministrationCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
