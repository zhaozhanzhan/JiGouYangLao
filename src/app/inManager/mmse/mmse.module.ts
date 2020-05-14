import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { InfoComponent } from "./info/info.component";
import { MMSEAssessmentRoutingModule } from "./mmse-routing.module";
import { AgeCountPipe } from "./age_pipe";
import { MMSELevelPipe } from "./mmseLevel_pipe";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    MMSEAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ListComponent, InfoComponent, AgeCountPipe, MMSELevelPipe]
})
export class MMSEAssessmentModule {}
