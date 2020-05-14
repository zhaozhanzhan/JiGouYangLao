import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ATrainingReComponent } from "./aTrainingRe.component";
describe("ATrainingReComponent", () => {
  let component: ATrainingReComponent;
  let fixture: ComponentFixture<ATrainingReComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ATrainingReComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ATrainingReComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
