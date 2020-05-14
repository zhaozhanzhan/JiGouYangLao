import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { TumbleAssessmentRoutingModule } from "./tumble-routing.module";
import { TumbleLevelPipe } from "./tumbleLevel_pipe";
import { AgeCountPipe } from "./age_pipe";
import { MirrortechCommonModule } from "../../common/common.module";
import { CheckComponent } from "./check/check.component";
import { ENgxPrintModule } from "e-ngx-print";
import { CheckPrintComponent } from "./checkPrint/checkPrint.component";
@NgModule({
  imports: [
    TumbleAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent, AgeCountPipe, TumbleLevelPipe,CheckComponent,CheckPrintComponent]
})
export class TumbleAssessmentModule {}
