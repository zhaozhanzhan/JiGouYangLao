import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PharmaceuticalAdministrationAddEditComponent } from './pharmaceuticalAdministration-add-edit.component';



describe('PharmaceuticalAdministrationAddEditComponent', () => {
  let component: PharmaceuticalAdministrationAddEditComponent;
  let fixture: ComponentFixture<PharmaceuticalAdministrationAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PharmaceuticalAdministrationAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PharmaceuticalAdministrationAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
