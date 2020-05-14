import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupRegComponent } from "./groupReg.component";
describe("GroupRegComponent", () => {
  let component: GroupRegComponent;
  let fixture: ComponentFixture<GroupRegComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRegComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRegComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
