import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { PatientDetailsComponent } from "./patientDetails/patientDetails.component";
import { CasePrintComponent } from "./casePrint/casePrint.component";
import { LongTermComponent } from "./longTerm/longTerm.component";
import { OutTypeComponent } from "./outType/outType.component"


const routes: Routes = [
  {
    path: "wardMage",
    component: WardMageComponent //病人卡片
  },
  {
    path: "patientDetails",
    component: PatientDetailsComponent //病人病历处方详情
  },
  {
    path: "caseDetails",
    component: CasePrintComponent //病历处方打印
  },
  {
    path: "outType",
    component: OutTypeComponent //外出人数
    component: CasePrintComponent //病历处方打印
  },
  {
    path: "longTerm",
    component: LongTermComponent //长期医嘱单
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutpatientManageRoutingModule {}
