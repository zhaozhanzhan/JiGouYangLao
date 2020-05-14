import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HospitalRegistrationComponent } from "./hospitalRegistration/hospitalRegistration.component";
import { HospitalRegistrationCheckAddEditComponent } from "./hospitalRegistration/hospitalRegistration-add-edit/hospitalRegistration-add-edit.component";
import { HospitalRegistrationCheckComponent } from "./hospitalRegistration/hospitalRegistration-check/hospitalRegistration-check.component";
import { CheckInInforComponent } from "./checkInInfor/checkInInfor.component";
import { CheckInInforCheckComponent } from "./checkInInfor/checkInInfor-check/checkInInfor-check.component";
import { CheckInInforAddEditComponent } from "./checkInInfor/checkInInfor-add-edit/checkInInfor-add-edit.component";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { DisplayMedListComponent } from "./display-med-list/display-med-list.component";
import { TransfuseLabelComponent } from "./transfuse-label/transfuse-label.component";
import { VeinMedListComponent } from "./vein-med-list/vein-med-list.component";
import { OnHandOrderComponent } from "./onHandOrder/onHandOrder.component";
import { SummarizatMedicineComponent } from "./summarizat-medicine/summarizat-medicine.component";
const routes: Routes = [
  {
    path: "hospitalRegistration",
    component: HospitalRegistrationComponent //住院登记列表
  },
  {
    path: "hospitalRegistration/addEdit",
    component: HospitalRegistrationCheckAddEditComponent //住院登记添加
  },
  {
    path: "hospitalRegistration/check",
    component: HospitalRegistrationCheckComponent //住院登记查看
  },
  {
    path: "checkInInfor",
    component: CheckInInforComponent //入院信息列表
  },
  {
    path: "checkInInfor/addEdit",
    component: CheckInInforAddEditComponent //入院信息列表添加
  },
  {
    path: "checkInInfor/check",
    component: CheckInInforCheckComponent //入院信息列表查看
  },
  {
    path: "wardMage",
    component: WardMageComponent //病案管理卡片
  },
  {
    path: "DisplayMedList",
    component: DisplayMedListComponent //摆药发药
  },
  {
    path: "summarizat",
    component: SummarizatMedicineComponent //汇总发药
  },
  {
    path: "TransfuseLabel",
    component: TransfuseLabelComponent //输液标签
  },
  {
    path: "VeinMedList",
    component: VeinMedListComponent //静脉用药
  },
  {
    path: "onHandOrder",
    component: OnHandOrderComponent //待处理医嘱
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NurseWorkstationRoutingModule {}
