import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { PatientFilesComponent } from "./patientFiles.component";

const routes: Routes = [
  {
    path: "",
    component: PatientFilesComponent,
    children: [
      {
        path: "medicalRecord",
        loadChildren:
          "../medicalRecord/medicalRecord.module#MedicalRecordModule",
        data: { reuse: false, title: "病案首页" }
      },
      {
        path: "medicalRecordJN",
        loadChildren:
          "../medicalRecordJN/medicalRecordJN.module#MedicalRecordJNModule",
        data: { reuse: false, title: "病案首页" }
      },
      {
        path: "temperatureChart",
        loadChildren:
          "../temperatureChart/temperatureChart.module#TemperatureChartModule",
        data: { reuse: false, title: "体温单" }
      },
      {
        path: "temperatureChart/normal",
        loadChildren:
          "../temperatureChart/temperatureChart.module#TemperatureChartModule",
        data: { reuse: false, title: "体温单" }
      },
      {
        path: "diabetesOrder",
        loadChildren:
          "../diabetesOrder/diabetesOrder.module#DiabetesOrderModule",
        data: { reuse: false, title: "糖尿病记录单" }
      },
      {
        path: "bloodOrder",
        loadChildren:
          "../bloodPressureRecord/bloodPressureRecord.module#BloodPressureRecordModule",
        data: { reuse: false, title: "血压记录单" }
      },
      {
        path: "standingOrder",
        loadChildren:
          "../standingOrder/standingOrder.module#StandingOrderModule",
        data: { reuse: false, title: "长期医嘱单" }
      },
      {
        path: "temporaryOrder",
        loadChildren:
          "../temporaryOrder/temporaryOrder.module#TemporaryOrderModule",
        data: { reuse: false, title: "临时医嘱单" }
      },
      {
        path: "nursingOrder",
        loadChildren: "../nursingOrder/nursingOrder.module#NursingOrderModule",
        data: { reuse: false, title: "一般护理记录单" }
      },
      {
        path: "nursingOrderYG",
        loadChildren:
          "../nursingOrderYG/nursingOrderYG.module#NursingOrderYGModule",
        data: { reuse: false, title: "护理记录单" }
      },
      {
        path: "intraMedication",
        loadChildren:
          "../intraMedication/intraMedication.module#IntraMedicationModule",
        data: { reuse: false, title: "静脉用药执行情况粘贴单" }
      },
      {
        path: "apparatusCheck",
        loadChildren:
          "../apparatusCheck/apparatusCheck.module#ApparatusCheckModule",
        data: { reuse: false, title: "器械检查报告粘贴单" }
      },
      {
        path: "assayOrder",
        loadChildren: "../assayOrder/assayOrder.module#AssayOrderModule",
        data: { reuse: false, title: "血、尿、粪常规化验报告" }
      },
      {
        path: "specialOrder",
        loadChildren: "../specialOrder/specialOrder.module#SpecialOrderModule",
        data: { reuse: false, title: "特殊化验报告" }
      },
      {
        path: "residentAdmiNote",
        loadChildren:
          "../residentAdmiNote/residentAdmiNote.module#ResidentAdmiNoteModule",
        data: { reuse: false, title: "入院记录" }
      },
      {
        path: "progressNote",
        loadChildren: "../progressNote/progressNote.module#ProgressNoteModule",
        data: { reuse: false, title: "病程记录" }
      },
      {
        path: "firstCare",
        loadChildren: "../first-care/first-care.module#FirstCareModule",
        data: { reuse: false, title: "首次护理记录单" }
      },
      {
        path: "medicalScore",
        loadChildren: "../medicalScore/medicalScore.module#MedicalScoreModule",
        data: { reuse: false, title: "病案质量评分" }
      },
      {
        path: "attendingPhysician",
        loadChildren:
          "../attendingPhysician/attendingPhysician.module#AttendingPhysicianModule",
        data: { reuse: false, title: "变更主治医生" }
      },
      {
        path: "leaveOut",
        loadChildren: "../leaveOut/leaveOut.module#LeaveOutModule",
        data: { reuse: false, title: "请假外出" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientFilesRoutingModule {}
