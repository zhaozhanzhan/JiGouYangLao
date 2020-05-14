import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from "ng-zorro-antd";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { FormValidService } from "../../common/service/FormValid.Service";
import { GlobalService } from "../../common/service/GlobalService";
import { CapacityAddComponent } from "./capacity-add/capacity-add.component";
import { CapacityListComponent } from "./capacity-list/capacity-list.component";
import { MirrortechCommonModule } from "../../common/common.module";
import { ENgxPrintModule } from "e-ngx-print";
import { PrintComponent } from "./print/print.component";
import { PrintContentComponent } from "./printContent/printContent.component";
import { PrintDetailsComponent } from "./printDetails/printDetails.component";
import { CapacityDisabledComponent } from "./capacity-disabled/capacity-disabled.component";
import { CapacityAssessJNRoutingModule } from "./capacity-assess-JN-routing.module";

@NgModule({
  imports: [
    // 模块
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    CapacityAssessJNRoutingModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [
    // 服务
    HttpReqService,
    JsUtilsService,
    FormValidService,
    GlobalService,
    {
      provide: NZ_MESSAGE_CONFIG,
      useValue: {
        nzDuration: 3000,
        nzMaxStack: 7,
        nzPauseOnHover: true,
        nzAnimate: true
      }
    }
  ],
  declarations: [
    CapacityListComponent,
    CapacityAddComponent,
    CapacityDisabledComponent,
    PrintComponent,
    PrintContentComponent,
    PrintDetailsComponent
  ]
})
export class CapacityAssessJNModule {}
