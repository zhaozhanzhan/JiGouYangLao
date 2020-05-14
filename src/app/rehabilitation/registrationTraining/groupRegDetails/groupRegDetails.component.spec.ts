import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupRegDetailsComponent } from "./groupRegDetails.component";
describe("GroupRegDetailsComponent", () => {
  let component: GroupRegDetailsComponent;
  let fixture: ComponentFixture<GroupRegDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRegDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRegDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
