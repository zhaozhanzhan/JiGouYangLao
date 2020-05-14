/*
 * @Author: dakui.tian
 * @date: Do not edit
 * @LastEditors: dakui.tian
 * @LastEditTime: 2019-09-11 15:44:37
 * @Description:
 */
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChildrenLayoutComponent } from "../children-layouts/children-layout.component";

const routes: Routes = [
  {
    path: "homePage",
    loadChildren: "../home-page/home-page.module#HomePageModule"
  },
  {
    path: "nursingManage",
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "oldmanList",
        loadChildren: "../nursing/oldman/oldman.module#OldmanModule"
      },
      {
        path: "hospitalFile",
        loadChildren:
          "../inManager/elderly-file/elderly-file.module#ElderlyFileModule"
      },
      {
        path: "resmemo",
        loadChildren: "../nursing/resmemo/resmemo.module#ResMemoModule"
      },
      {
        path: "shpememo",
        loadChildren: "../nursing/shpememo/shpememo.module#ShpeMemoModule"
      },
      {
        path: "rollmemo",
        loadChildren: "../nursing/rollmemo/rollmemo.module#RollMemoModule"
      },
      {
        path: "jordanclean",
        loadChildren:
          "../nursing/jordanclean/jordanclean.module#JordanCleanModule"
      },
      {
        path: "checkrecord",
        loadChildren:
          "../nursing/checkrecord/checkrecord.module#CheckRecordModule"
      },
      {
        path: "handoversheet",
        loadChildren:
          "../nursing/handoversheet/handoversheet.module#HandoverSheetModule"
      },
      {
        path: "personalEffects",
        loadChildren:
          "../nursing/personalEffects/personalEffects.module#PersonalEffectsModule"
      },
      {
        path: "itemsOut",
        loadChildren: "../nursing/itemOut/itemOut.module#ItemOutModule"
      },
      {
        path: "serviceProject",
        loadChildren:
          "../nursing/service-project/service-project.module#ServiceProjectModule"
      },
      {
        path: "serviceRecord",
        loadChildren:
          "../nursing/service-record/service-record.module#ServiceRecordModule"
      },
      {
        path: "servicePlan",
        loadChildren:
          "../nursing/service-plan/service-plan.module#ServicePlanModule"
      },
      {
        path: "serviceCare",
        loadChildren:
          "../nursing/service-care/service-care.module#ServiceCareModule"
      },
      {
        path: "nursingStatistics",
        loadChildren:
          "../officeworkManage/employeesManage/nursingStatistics/nursingStatistics.module#NursingStatisticsModule"
      },
      {
        path: "employees",
        loadChildren:
          "../officeworkManage/employeesManage/employees/employees.module#EmployeesModule"
      },
      {
        path: "employeesGroup",
        loadChildren:
          "../officeworkManage/employeesManage/employeesGroup/employeesGroup.module#EmployeesGroupModule"
      },
      {
        path: "schedules",
        loadChildren:
          "../officeworkManage/employeesManage/schedules/schedules.module#SchedulesModule"
      },
      {
        path: "schTemplet",
        loadChildren:
          "../officeworkManage/employeesManage/schTemplet/schTemplet.module#SchTempletModule"
      },
      {
        path: "scheduling",
        loadChildren:
          "../officeworkManage/employeesManage/scheduling/scheduling.module#SchedulingModule"
      },
      {
        path: "nursingGrade", //
        loadChildren:
          "../operationManage/nursingService/nursingGrade/nursingGrade.module#NursingGradeModule"
      },
      {
        path: "resCase", //
        loadChildren:
          "../operationManage/nursingService/resCaseManager/resCase.module#ResCaseModule"
      },
      {
        path: "resCaseBase", //
        loadChildren:
          "../operationManage/nursingService/resCaseBaseManager/resCaseBase.module#ResCaseBaseModule"
      },
      {
        path: "resCaseType", //
        loadChildren:
          "../operationManage/nursingService/resCaseTypeManager/resCaseType.module#ResCaseTypeModule"
      },
      {
        path: "appConfig", //
        loadChildren:
          "../operationManage/nursingService/nursingAppConfig/nursingAppConfig.module#NursingAppConfigModule"
      }
    ]
  },
  {
    path: "rehabilitationManage",
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "",
        loadChildren:
          "../rehabilitation/rehabilitation.module#RehabilitationModule"
      }
    ]
  },
  {
    path: "safetyManage",
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "fireControl",
        loadChildren: "../safetyment/fire/fire.module#FireAssessmentModule"
      },
      {
        path: "responsibility",
        loadChildren:
          "../safetyment/responsibility/responsibility.module#ResponsibilityAssessmentModule"
      },
      {
        path: "fireExtinguisher",
        loadChildren:
          "../safetyment/fireExtinguisher/fireExtinguisher.module#FireExtinguisherAssessmentModule"
      },
      {
        path: "fireInspection",
        loadChildren:
          "../safetyment/fireInspection/fireInspection.module#fireInspectionAssessmentModule"
      },
      {
        path: "statistics",
        loadChildren:
          "../safetyment/statistics/statistics.module#statisticsAssessmentModule"
      },
      {
        path: "fireInspectionlist",
        loadChildren:
          "../safetyment/fireInspectionlist/fireInspectionlist.module#FireInspectionlistAssessmentModule"
      },
      {
        path: "foodSafety",
        loadChildren:
          "../safetyment/foodSafety/foodSafety.module#foodSafetyAssessmentModule"
      },
      {
        path: "safetySnap",
        loadChildren:
          "../safetyment/safetySnap/safetySnap.module#SafetySnapAssessmentModule"
      }
    ]
  },
  {
    path: "officeworkManage",
    component: ChildrenLayoutComponent,
    children: [
      // {
      //   path: "employees",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/employees/employees.module#EmployeesModule"
      // },
      // {
      //   path: "employeesGroup",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/employeesGroup/employeesGroup.module#EmployeesGroupModule"
      // },
      // {
      //   path: "schedules",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/schedules/schedules.module#SchedulesModule"
      // },
      // {
      //   path: "schTemplet",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/schTemplet/schTemplet.module#SchTempletModule"
      // },
      // {
      //   path: "scheduling",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/scheduling/scheduling.module#SchedulingModule"
      // },
      // {
      //   path: "nursingStatistics",
      //   loadChildren:
      //     "../officeworkManage/employeesManage/nursingStatistics/nursingStatistics.module#NursingStatisticsModule"
      // },
      {
        path: "warehouse",
        loadChildren:
          "../officeworkManage/warehouse/warehouse.module#WarehouseModule"
      },
      {
        path: "donate",
        loadChildren: "../officeworkManage/donate/donate.module#DonateModule"
      },
      {
        path: "personnelFileManage",
        loadChildren:
          "../officeworkManage/personnelFileManage/personnelFileManage.module#PersonnelFileManageModule"
      },
      {
        path: "organizationalManage",
        loadChildren:
          "../officeworkManage/organizationalManage/organizationalManage.module#OrganizationalManageModule"
      },
      {
        path: "property",
        loadChildren:
          "../officeworkManage/property/property.module#PropertyModule"
      }
    ]
  },
  {
    path: "operationManage",
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "dayin",
        loadChildren:
          "../operationManage/cardPrint/bedCardPrint/bedCardPrint.module#BedCardPrintModule"
      },
      {
        path: "dayinlou",
        loadChildren:
          "../operationManage/cardPrint/roomCardPrint/roomCardPrint.module#RoomCardPrintModule"
      },
      {
        path: "usermanager",
        loadChildren: "../operationManage/usermanager/user.module#UserModule"
      },
      {
        path: "buildingmanager",
        loadChildren:
          "../operationManage/buildingManager/building.module#BuildingModule"
      },
      {
        path: "buildingCode",
        loadChildren:
          "../operationManage/buildingCodePrint/buildingCode.module#BuildingCodeModule"
      },
      {
        path: "administrativeOffices",
        loadChildren:
          "../operationManage/administrativeOffices/administrativeOffices.module#AdministrativeOfficesModule"
      },
      {
        path: "digitalDictionary",
        loadChildren:
          "../operationManage/digitalDictionary/digitalDictionary.module#DigitalDictionaryModule"
      },
      {
        path: "menuManager",
        loadChildren: "../operationManage/menuManager/menu.module#MenuModule"
      },
      {
        path: "department",
        loadChildren:
          "../operationManage/department/department.module#DepartmentModule"
      },
      // {
      //   path: "nursingGrade", //
      //   loadChildren:
      //     "../operationManage/nursingService/nursingGrade/nursingGrade.module#NursingGradeModule"
      // },
      // {
      //   path: "resCase", //
      //   loadChildren:
      //     "../operationManage/nursingService/resCaseManager/resCase.module#ResCaseModule"
      // },
      // {
      //   path: "resCaseBase", //
      //   loadChildren:
      //     "../operationManage/nursingService/resCaseBaseManager/resCaseBase.module#ResCaseBaseModule"
      // },
      // {
      //   path: "resCaseType", //
      //   loadChildren:
      //     "../operationManage/nursingService/resCaseTypeManager/resCaseType.module#ResCaseTypeModule"
      // },
      // {
      //   path: "appConfig", //
      //   loadChildren:
      //     "../operationManage/nursingService/nursingAppConfig/nursingAppConfig.module#NursingAppConfigModule"
      // },
      {
        path: "role",
        loadChildren:
          "../operationManage/roleManager/role.module#RoleManagerModule"
      }
    ]
  },
  {
    path: "inManager",
    component: ChildrenLayoutComponent,
    children: [
      // {
      //   path: "infoInterviewManager",
      //   loadChildren:
      //     "../inManager/info-interview-manager/info-interview-manager.module#InfoInterviewManagerModule",
      //   data: { title: "信息调访" }
      // },
      {
        path: "infoInterManager",
        loadChildren:
          "../inManager/info-inter-manager/info-inter-manager.module#InfoInterManagerModule",
        data: { title: "信息调访" }
      },
      {
        path: "elderlyFile",
        loadChildren:
          "../inManager/elderly-file/elderly-file.module#ElderlyFileModule",
        data: { title: "住院档案" }
      },
      {
        path: "serviceChange",
        loadChildren:
          "../inManager/service-change/service-change.module#ServiceChangeModule",
        data: { title: "服务异动" }
      },
      {
        path: "admisRegist",
        loadChildren:
          "../inManager/admis-regist/admis-regist.module#AdmisRegistModule",
        data: { title: "入院登记" }
      },
      {
        path: "admissionAssessment",
        loadChildren:
          "../inManager/admission-assessment/admission-assessment.module#AdmissionAssessmentModule",
        data: { title: "入院评估" }
      },
      {
        path: "admissionAssessmentJN",
        loadChildren:
          "../inManager/admission-assessment-JN/admission-assessment-JN.module#AdmissionAssessmentJNModule",
        data: { title: "江南入院评估" }
      },
      {
        path: "admissionReview",
        loadChildren:
          "../inManager/admission-review/admission-review-manager.module#AdmissionReviewManagerModule",
        data: { title: "入院审核" }
      },
      {
        path: "agreementManage",
        loadChildren: "../inManager/agreement/agreement.module#AgreementModule",
        data: { title: "合同管理" }
      },
      {
        path: "capacityAssess",
        loadChildren:
          "../inManager/capacity-assess/capacity-assess.module#CapacityAssessModule",
        data: { title: "能力评估" }
      },
      {
        path: "capacityAssessJN",
        loadChildren:
          "../inManager/capacity-assess-JN/capacity-assess-JN.module#CapacityAssessJNModule",
        data: { title: "能力评估" }
      },
      {
        path: "nursingAssess",
        loadChildren:
          "../inManager/nursingAssess/nursingAssess.module#NursingAssessModule",
        data: { title: "护理评估" }
      },
      {
        path: "createAssess",
        loadChildren:
          "../inManager/createAssess/createAssess.module#CreateAssessModule",
        data: { title: "照护评估" }
      },
      {
        path: "contract",
        loadChildren:
          "../inManager/contractTemp/contractTemp.module#ContractTempModule",
        data: { title: "合同模板" }
      },
      {
        path: "dischargeManage",
        loadChildren:
          "../inManager/discharged-registration/discharged-registration-manager.module#DischargedRegistrationManagerModule",
        data: { title: "出院管理" }
      },
      {
        path: "consultManage",
        loadChildren:
          "../inManager/consult-manage/consult-manage.module#ConsultManageModule",
        data: { title: "咨询入住" }
      },
      {
        path: "barthel",
        loadChildren:
          "../inManager/barthel/barthel.module#BarthelAssessmentModule",
        data: { title: "巴氏评定" }
      },
      {
        path: "tumble",
        loadChildren:
          "../inManager/tumble/tumble.module#TumbleAssessmentModule",
        data: { title: "跌倒评估" }
      },
      {
        path: "mmse",
        loadChildren: "../inManager/mmse/mmse.module#MMSEAssessmentModule",
        data: { title: "MMSE评估" }
      },
      {
        path: "bedsore",
        loadChildren:
          "../inManager/bedsore/bedsore.module#BedsoreAssessmentModule",
        data: { title: "压疮评估" }
      },
      {
        path: "guideFlow",
        loadChildren: "../inManager/guideFlow/guideFlow.module#GuideFlowModule",
        data: { title: "入住流程" }
      },
      {
        path: "infollow",
        loadChildren: "../inManager/infollow/infollow.module#InfollowModule",
        data: { title: "入住跟随" }
      }
    ]
  },
  {
    path: "hospitalPharmacy",
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "pharmacyManagement",
        loadChildren:
          "../hospitalPharmacy/pharmacyManagement/pharmacyManagement.module#PharmacyManagementModule",
        data: { title: "药库管理" }
      },
      // {
      //   path: "doctorWorkstation",
      //   loadChildren:
      //     "../hospitalPharmacy/doctorWorkstation/doctorWorkstation.module#DoctorWorkstationModule",
      //   data: { title: "医生工作站" }
      // },
      {
        path: "pharmacyRoomManagement",
        loadChildren:
          "../hospitalPharmacy/pharmacy-management/pharmacy-management.module#PharmacyManagementModule",
        data: { title: "药房管理" }
      },
      {
        path: "medicPurchApply",
        loadChildren:
          "../hospitalPharmacy/pharmacyManagement/medic-purch-apply/medic-purch-apply.module#MedicPurchApplyModule",
        data: { title: "药品采购申请" }
      },
      {
        path: "medicPurchAppro",
        loadChildren:
          "../hospitalPharmacy/pharmacyManagement/medic-purch-appro/medic-purch-appro.module#MedicPurchApproModule",
        data: { title: "药品采购审批" }
      },
      {
        path: "outpatientPills",
        loadChildren:
          "../medicalManage/outpatientPills/outpatientPills.module#OutpatientPillsModule",
        data: { title: "门诊发药" }
      }
    ]
  },
  {
    path: "medicalManage", //院内医疗模块
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "nurseWorkstation",
        loadChildren:
          "../medicalManage/nurseWorkstation/nurseWorkstation.module#NurseWorkstationModule",
        data: { title: "护士工作站" }
      },
      {
        path: "doctorWorkstation",
        loadChildren:
          "../medicalManage/doctorWorkstation/doctorWorkstation.module#DoctorWorkstationModule",
        data: { title: "医生工作站" }
      },
      {
        path: "nurseRecord",
        loadChildren:
          "../medicalManage/nurseManagement/nurseRecord/nurse-management.module#NurseManagementModule",
        data: { title: "护士档案" }
      },
      {
        path: "nurseGroup",
        loadChildren:
          "../medicalManage/nurseManagement/nurseGroup/nurse-group.module#NurseGroupModule",
        data: { title: "护士班组" }
      },
      {
        path: "doctorGroup",
        loadChildren:
          "../medicalManage/doctorManagement/doctor-record/doctor-record.module#DoctorRecordModule",
        data: { title: "医生档案" }
      },
      {
        path: "officeList",
        loadChildren:
          "../medicalManage/officeManagement/list/list.module#officeListModule",
        data: { title: "科室列表" }
      },
      {
        path: "sickAreaList",
        loadChildren:
          "../medicalManage/sickAreaManagement/list/list.module#ListModule",
        data: { title: "病区列表" }
      },
      {
        path: "patientFiles",
        loadChildren:
          "../medicalManage/patientFiles/patientFiles.module#PatientFilesModule",
        data: { title: "患者病历档案" }
      },
      {
        path: "outpatienManage",
        loadChildren:
          "../medicalManage/outpatientManage/outpatientManage.module#OutpatientManageModule",
        data: { title: "门诊管理" }
      },
      {
        path: "outpatienCaseTemplate",
        loadChildren:
          "../medicalManage/outpatienCaseTemplate/outpatienCaseTemplate.module#OutpatienCaseTemplateModule",
        data: { title: "门诊病历模板" }
      },
      {
        path: "medicalDictionary",
        loadChildren:
          "../medicalManage/medicalDictionary/medical-dic.module#MedicalDicModule",
        data: { title: "医疗字典" }
      },
      {
        path: "medicalEditorTemp",
        loadChildren:
          "../medicalManage/medicalEditorTemp/medicalEditorTemp.module#MedicalEditorTempModule",
        data: { title: "电子病历模板" }
      },
      {
        path: "trustTakeMedicine",
        loadChildren:
          "../medicalManage/entrustMedicine/entrust-medicine.module#EntrustMedicineModule",
        data: { title: "委托用药" }
      },
      {
        path: "sendMedicine",
        loadChildren:
          "../medicalManage/send-medicine/send-medicine.module#SendMedicineModule",
        data: { title: "委托发药" }
      },
      {
        path: "medicRegist",
        loadChildren:
          "../medicalManage/medic-regist/medic-regist.module#MedicRegistModule",
        data: { title: "服药登记" }
      },
      {
        path: "medicalAgreement",
        loadChildren:
          "../medicalManage/agreement/agreement.module#AgreementModule",
        data: { title: "医患沟通" }
      },
      {
        path: "medicalAgreementTemplate",
        loadChildren:
          "../medicalManage/agreementTemplate/agreementTemplate.module#AgreementTemplateModule",
        data: { title: "医患沟通模板" }
      },
      {
        path: "medicalAgreementType",
        loadChildren:
          "../medicalManage/agreementType/agreementType.module#AgreementTypeModule",
        data: { title: "医患沟通" }
      },
      {
        path: "illcatalog",
        loadChildren:
          "../medicalManage/illcatalog/illcatalog.module#IllcatalogModule",
        data: { title: "病案目录" }
      }
    ]
  },
  {
    path: "FE", //费用结算模块模块
    component: ChildrenLayoutComponent,
    children: [
      {
        path: "FEDSCT",
        loadChildren: "../FE/FEDSCT/FEDSCT.module#FEDSCTModule",
        data: { title: "抵扣劵" }
      },
      {
        path: "FERS",
        loadChildren: "../FE/FERS/FERS.module#FERSModule",
        data: { title: "补价券" }
      },
      {
        path: "FECSM",
        loadChildren: "../FE/FECSM/FECSM.module#FECSMModule",
        data: { title: "消费登记" }
      },
      {
        path: "FECOCTG",
        loadChildren: "../FE/FECOCTG/FECOCTG.module#FECOCTGModule",
        data: { title: "消费类别" }
      },
      {
        path: "FECOPRO",
        loadChildren: "../FE/FECOPRO/FECOPRO.module#FECOPROModule",
        data: { title: "消费项目" }
      },
      {
        path: "FEACDEF",
        loadChildren: "../FE/FEACDEF/account.module#AccountModule",
        data: { title: "缴存账目" }
      },
      {
        path: "FEDPS",
        loadChildren:
          "../FE/FEDPS/account-register.module#AccountRegisterModule",
        data: { title: "缴存登记" }
      },
      {
        path: "FEMOSTM",
        loadChildren: "../FE/FEMOSTM/femostm.module#FEMOSTMModule",
        data: { title: "月度结算" }
      }, {
        path: "FEOTSTM",
        loadChildren: "../FE/FEOTSTM/feotstm.module#FEOTSTMModule",
        data: { title: "出院结算" }
      },
      {
        path: "FEBIL",
        loadChildren: "../FE/FEBIL/FEBIL.module#FEBILModule",
        data: { title: "消费明细" }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RootLayoutRoutingModule { }
