import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { NursingAssessComponent } from "./nursingAssess.component";
import { NursingAssessRoutingModule } from "./nursingAssess-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ApplyComponent } from "./apply/apply.component";
import { AssessmentComponent } from "./assessment/assessment.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    NursingAssessRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [NursingAssessComponent, ApplyComponent, AssessmentComponent]
})
export class NursingAssessModule {}
