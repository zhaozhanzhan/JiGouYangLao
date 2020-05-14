import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { AgeCountPipe } from "./age_pipe";
import { BarthelAssessmentRoutingModule } from "./barthel-routing.module";
import { BarthelLevelPipe } from "./barthelLevel_pipe";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    BarthelAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent, AgeCountPipe, BarthelLevelPipe]
})
export class BarthelAssessmentModule {}
