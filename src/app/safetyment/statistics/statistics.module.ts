import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ListComponent } from "./list/list.component";
import { statisticsAssessmentRoutingModule } from "./statistics-routing.module";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    statisticsAssessmentRoutingModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  // declarations: []
  declarations: [ListComponent]
})
export class statisticsAssessmentModule {}
