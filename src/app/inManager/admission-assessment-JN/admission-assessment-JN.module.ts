import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { AddDisabledComponent } from "./addDisabled/addDisabled.component";
import { CheckComponent } from "./check/check.component";
import { TumbleComponent } from "./tumble/tumble.component";
import { TumbleDisabledComponent } from "./tumbleDisabled/tumbleDisabled.component";
import { CheckDisabledComponent } from "./checkDisabled/checkDisabled.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { AdmissionassessmentJNRoutingModule } from "./admission-assessment-JN-routing.module";
import { AdmissionassessmentJNComponent } from "./admission-assessment-JN.component";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionassessmentJNRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    AdmissionassessmentJNComponent,
    AddComponent,
    CheckComponent,
    TumbleComponent,
    TumbleDisabledComponent,
    CheckDisabledComponent,
    AddDisabledComponent
  ]
})
export class AdmissionAssessmentJNModule {}
