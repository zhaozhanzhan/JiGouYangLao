import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { DoctorWorkstationRoutingModule } from "./doctorWorkstation-routing.module";
import { AssessmentRecordComponent } from './assessment-record/assessment-record.component';
import { CommunicationComponent } from './communication/communication.component';
import { InhospitalAssessComponent } from './assessment-record/inhospital-assess/inhospital-assess.component';
import { OperationAssessComponent } from './assessment-record/operation-assess/operation-assess.component';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DoctorWorkstationRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    WardMageComponent,
    AssessmentRecordComponent,
    CommunicationComponent,
    InhospitalAssessComponent,
    OperationAssessComponent //病区管理列表
  ],
  entryComponents: [
    WardMageComponent //病区管理列表
  ]
})
export class DoctorWorkstationModule {}
