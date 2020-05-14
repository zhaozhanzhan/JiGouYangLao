import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RehabilitionTeamComponent } from "./rehabilitionTeam.component";

describe("RehabilitionTeamComponent", () => {
  let component: RehabilitionTeamComponent;
  let fixture: ComponentFixture<RehabilitionTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RehabilitionTeamComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
