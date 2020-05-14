import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ResCaseTypeRoutingModule } from "./resCaseType-routing.module";
import { ResCaseTypeComponent } from "./resCaseType.component";

@NgModule({
  imports: [
    ResCaseTypeRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [ResCaseTypeComponent]
})
export class ResCaseTypeModule {}
