import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { OutpatientManageRoutingModule } from "./outpatientManage-routing.module";
import { PatientDetailsComponent } from "./patientDetails/patientDetails.component";
import { CasePrintComponent } from "./casePrint/casePrint.component";
import { LongTermComponent } from "./longTerm/longTerm.component";
import { OutTypeComponent } from "./outType/outType.component"

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    OutpatientManageRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    WardMageComponent, //病区管理列表
    PatientDetailsComponent, //病人病历处方详情
    CasePrintComponent, //病历处方打印
    LongTermComponen,
    OutTypeComponent //病历处方打印
  ],
  entryComponents: [
    WardMageComponent, //病区管理列表
    PatientDetailsComponent, //病人病历处方详情
    CasePrintComponent, //病历处方打印
    OutTypeComponent,
    LongTermComponent
  ]
})
export class OutpatientManageModule {}
