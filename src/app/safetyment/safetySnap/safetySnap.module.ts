import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { SafetySnapAssessmentRoutingModule } from "./safetySnap-routing.module";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    SafetySnapAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  // declarations: []
  declarations: [ListComponent, InfoComponent]
})
export class SafetySnapAssessmentModule {}
