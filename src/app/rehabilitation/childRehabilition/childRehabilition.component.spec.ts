import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ChildRehabilitionComponent } from "./childRehabilition.component";

describe("RehabilitationRegistrationComponent", () => {
  let component: ChildRehabilitionComponent;
  let fixture: ComponentFixture<ChildRehabilitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChildRehabilitionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildRehabilitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
