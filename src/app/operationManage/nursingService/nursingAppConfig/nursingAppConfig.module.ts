import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../../common/common.module";
import { NursingAppConfigRoutingModule } from "./nursingAppConfig-routing.module";
import { NursingAppConfigComponent } from "./nursingAppConfig.component";

@NgModule({
  imports: [
    NursingAppConfigRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [NursingAppConfigComponent]
})
export class NursingAppConfigModule {}
