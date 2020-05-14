import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { WardMageComponent } from "./wardMage/wardMage.component";
import { AssessmentRecordComponent } from './assessment-record/assessment-record.component';
import { CommunicationComponent } from './communication/communication.component';
import { InhospitalAssessComponent } from './assessment-record/inhospital-assess/inhospital-assess.component';
import { OperationAssessComponent } from './assessment-record/operation-assess/operation-assess.component';
// import { HtmlPipe } from "src/app/inManager/contractTemp/showContractTemp/html.pipe";

const routes: Routes = [
  {
    path: "wardMage",
    component: WardMageComponent //病案管理卡片
  },
  {
    path: "assessment",
    component: AssessmentRecordComponent
  },
  {
    path: "communication",
    component: CommunicationComponent
  },
  {
    path: "inhostpitalAssess",
    component: InhospitalAssessComponent
  },
  {
    path: "operationAssess",
    component: OperationAssessComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DoctorWorkstationRoutingModule {}
