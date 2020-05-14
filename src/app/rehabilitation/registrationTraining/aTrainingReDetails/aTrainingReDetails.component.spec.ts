import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ATrainingReDetailsComponent } from "./aTrainingReDetails.component";
describe("ATrainingReDetailsComponent", () => {
  let component: ATrainingReDetailsComponent;
  let fixture: ComponentFixture<ATrainingReDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ATrainingReDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATrainingReDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
