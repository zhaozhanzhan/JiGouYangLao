import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { GroupRegListComponent } from "./groupRegList.component";
describe("GroupRegListComponent", () => {
  let component: GroupRegListComponent;
  let fixture: ComponentFixture<GroupRegListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupRegListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRegListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
