import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OutTypeComponent } from "./outType.component";

describe("WardMageComponent", () => {
  let component: OutTypeComponent;
  let fixture: ComponentFixture<OutTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OutTypeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
