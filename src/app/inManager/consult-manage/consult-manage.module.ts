import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule, NZ_MESSAGE_CONFIG } from "ng-zorro-antd";
import { ConsultManageRoutingModule } from "./consult-manage-routing.module";
import { ConsultListComponent } from "./consult-list/consult-list.component";
import { HttpReqService } from "../../common/service/HttpUtils.Service";
import { JsUtilsService } from "../../common/service/JsUtils.Service";
import { FormValidService } from "../../common/service/FormValid.Service";
import { ConsultAddComponent } from "./consult-add/consult-add.component";
import { GlobalService } from "../../common/service/GlobalService";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    // 模块
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    ConsultManageRoutingModule,
    MirrortechCommonModule
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
    // 组件
    ConsultListComponent,
    ConsultAddComponent
  ]
})
export class ConsultManageModule {}
