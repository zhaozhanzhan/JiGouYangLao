import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MirrortechCommonModule } from "../../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { ENgxPrintModule } from "e-ngx-print";
import { NurseWorkstationRoutingModule } from "./nurseWorkstation-routing.module";
import { HospitalRegistrationComponent } from "./hospitalRegistration/hospitalRegistration.component";
import { HospitalRegistrationCheckAddEditComponent } from "./hospitalRegistration/hospitalRegistration-add-edit/hospitalRegistration-add-edit.component";
import { HospitalRegistrationCheckComponent } from "./hospitalRegistration/hospitalRegistration-check/hospitalRegistration-check.component";
import { CheckInInforComponent } from "./checkInInfor/checkInInfor.component";
import { CheckInInforAddEditComponent } from "./checkInInfor/checkInInfor-add-edit/checkInInfor-add-edit.component";
import { CheckInInforCheckComponent } from "./checkInInfor/checkInInfor-check/checkInInfor-check.component";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { DisplayMedListComponent } from "./display-med-list/display-med-list.component";
import { TransfuseLabelComponent } from "./transfuse-label/transfuse-label.component";
import { VeinMedListComponent } from "./vein-med-list/vein-med-list.component";
import { StatusPipe } from "./Status.Pipe";
import { OnHandOrderComponent } from "./onHandOrder/onHandOrder.component";
import { OnHandTemporaryOrderComponent } from "./onHandOrder/temporaryOrder/onHandTemporaryOrder.component";
import { OnHandStandingOrderComponent } from "./onHandOrder/standingOrder/onHandStandingOrder.component";
import { SummarizatMedicineComponent } from "./summarizat-medicine/summarizat-medicine.component";
import {
  GetRelativeInfoService,
  DosageFormPipe
} from "./get-relative-info.service";
@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NurseWorkstationRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [GetRelativeInfoService],
  declarations: [
    DosageFormPipe,
    StatusPipe,
    HospitalRegistrationComponent, //住院登记列表
    HospitalRegistrationCheckAddEditComponent, //住院登记添加
    HospitalRegistrationCheckComponent, //住院登记查看
    CheckInInforComponent, //入院信息列表
    CheckInInforAddEditComponent, //入院信息添加
    DisplayMedListComponent, // 打摆药单
    TransfuseLabelComponent, // 输液单
    VeinMedListComponent, // 静脉用药
    CheckInInforCheckComponent, //入院信息查看
    WardMageComponent, //病区管理列表
    OnHandOrderComponent, //待处理医嘱
    OnHandStandingOrderComponent, //待处理长期医嘱
    OnHandTemporaryOrderComponent, //待处理临时医嘱
    SummarizatMedicineComponent //汇总发药
  ],
  entryComponents: [
    HospitalRegistrationComponent, //住院登记列表
    HospitalRegistrationCheckAddEditComponent, //住院登记添加
    HospitalRegistrationCheckComponent, //住院登记查看
    CheckInInforComponent, //入院信息列表
    CheckInInforAddEditComponent, //入院信息添加
    CheckInInforCheckComponent, //入院信息查看
    WardMageComponent, //病区管理列表
    OnHandOrderComponent, //待处理医嘱
    OnHandStandingOrderComponent, //待处理长期医嘱
    OnHandTemporaryOrderComponent, //待处理临时医嘱
    SummarizatMedicineComponent //汇总发药
  ]
})
export class NurseWorkstationModule {}
