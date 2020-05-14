import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { AgeCountPipe } from "./age_pipe";
import { BradenLevelPipe } from "./bradenLevel_pipe";
import { BedsoreAssessmentRoutingModule } from "./bedsore-routing.module";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    BedsoreAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent, AgeCountPipe, BradenLevelPipe]
})
export class BedsoreAssessmentModule {}
