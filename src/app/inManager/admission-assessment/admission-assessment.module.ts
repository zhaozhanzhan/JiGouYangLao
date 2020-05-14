import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AdmissionassessmentRoutingModule } from "./admission-assessment-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { AddDisabledComponent } from "./addDisabled/addDisabled.component";
import { CheckComponent } from "./check/check.component";
import { TumbleComponent } from "./tumble/tumble.component";
import { TumbleDisabledComponent } from "./tumbleDisabled/tumbleDisabled.component";
import { CheckDisabledComponent } from "./checkDisabled/checkDisabled.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { AdmissionassessmentComponent } from "./admission-assessment.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionassessmentRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    AdmissionassessmentComponent,
    AddComponent,
    CheckComponent,
    TumbleComponent,
    TumbleDisabledComponent,
    CheckDisabledComponent,
    AddDisabledComponent
  ]
})
export class AdmissionAssessmentModule {}
