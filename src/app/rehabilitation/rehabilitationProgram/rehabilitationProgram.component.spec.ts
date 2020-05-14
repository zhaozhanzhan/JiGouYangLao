import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RehabilitationFilesComponent } from "../rehabilitationFiles/rehabilitationFiles.component";

describe("RehabilitationFilesComponent", () => {
  let component: RehabilitationFilesComponent;
  let fixture: ComponentFixture<RehabilitationFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RehabilitationFilesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RehabilitationFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
