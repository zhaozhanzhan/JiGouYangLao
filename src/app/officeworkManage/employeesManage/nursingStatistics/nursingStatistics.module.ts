import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { nursingStatisticsRoutingModule } from "./nursingStatistics-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { InfoInterviewManagerComponent } from "./list/info-interview-manager.component";
import { MirrortechCommonModule } from "../../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    nursingStatisticsRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [InfoInterviewManagerComponent, AddComponent, CheckComponent]
})
export class NursingStatisticsModule {}
