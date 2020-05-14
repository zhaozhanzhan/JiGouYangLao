import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from "ng-zorro-antd";
import { MirrortechCommonModule } from "src/app/common/common.module";
import { HttpReqService } from "src/app/common/service/HttpUtils.Service";
import { JsUtilsService } from "src/app/common/service/JsUtils.Service";
import { FormValidService } from "src/app/common/service/FormValid.Service";
import { GlobalService } from "src/app/common/service/GlobalService";
import { ENgxPrintModule } from "e-ngx-print";
import { EntrustMedicineService } from "./entrust-medicine.service";
import { OldmanComponent } from "./list/oldman-list.component";
import { OldmanRoutingModule } from "./oldman-routing.module";
@NgModule({
  imports: [
    // 模块
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule,
    OldmanRoutingModule
  ],
  providers: [
    // 服务
    HttpReqService,
    JsUtilsService,
    FormValidService,
    GlobalService,
    EntrustMedicineService,
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
  declarations: [OldmanComponent],
  exports: [],
  entryComponents: []
})
export class OldmanModule {}
