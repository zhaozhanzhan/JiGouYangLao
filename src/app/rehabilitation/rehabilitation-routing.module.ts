import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RehabilitationRegistrationComponent } from "./rehabilitation-registration/rehabilitation-registration.component";
import { RehabilitationPersonComponent } from "./rehabilitation-person/rehabilitation-person.component";
import { RehabilitationPersonInitialComponent } from "./rehabilitation-person-initial/rehabilitation-person-initial.component";
import { RehabilitationPersonMiddleComponent } from "./rehabilitation-person-middle/rehabilitation-person-middle.component";
import { RehabilitationPersonFinalComponent } from "./rehabilitation-person-final/rehabilitation-person-final.component";
import { RehabilitationGroupComponent } from "./rehabilitation-group/rehabilitation-group.component";
import { RehabilitationRegistrationAddComponent } from "./rehabilitation-registration/rehabilitationRegistrationAdd/rehabilitationRegistrationAdd.component";
import { PersonMiddleAddComponent } from "./rehabilitation-person-middle/personMiddleAdd/personMiddleAdd.component";
import { GroupAddComponent } from "./rehabilitation-group/groupAdd/groupAdd.component";
import { RehabilitationRegistrationCheckComponent } from "./rehabilitation-registration/rehabilitationRegistrationCheck/rehabilitationRegistrationCheck.component";
import { RehabilitationPersonAddComponent } from "./rehabilitation-person/rehabilitationPersonAdd/rehabilitationPersonAdd.component";
import { RehabilitationPersonCheckComponent } from "./rehabilitation-person/rehabilitationPersonCheck/rehabilitationPersonCheck.component";
import { GroupCheckComponent } from "./rehabilitation-group/groupCheck/groupCheck.component";
import { PersonMiddleCheckComponent } from "./rehabilitation-person-middle/personMiddleCheck/personMiddleCheck.component";
import { ChildRehabilitionComponent } from "./childRehabilition/childRehabilition.component";
import { RehabilitionTeamComponent } from "./rehabilitionTeam/rehabilitionTeam.component";
import { DictionaryDataComponent } from "./rehabilitionConfiguration/dictionaryData/dictionaryData.component";
import { AddDictionaryDataComponent } from "./rehabilitionConfiguration/dictionaryData/addDictionaryData/addDictionaryData.component";
import { RehabilitionConfigurationComponent } from "./rehabilitionConfiguration/rehabilitionConfiguration.component";
import { RehabilitationFilesComponent } from "./rehabilitationFiles/rehabilitationFiles.component";
import { RehabilitationProgramComponent } from "./rehabilitationProgram/rehabilitationProgram.component";
import { RegistrationTrainingComponent } from "./registrationTraining/registrationTraining.component";
import { PrintFilesComponent } from "./printFiles/printFiles.component";
import { ATrainingReComponent } from "./registrationTraining/aTrainingRe/aTrainingRe.component";
import { ATrainingReDetailsComponent } from "./registrationTraining/aTrainingReDetails/aTrainingReDetails.component";
import { GroupRegListComponent } from "./registrationTraining/groupRegList/groupRegList.component";
import { GroupRegDetailsComponent } from "./registrationTraining/groupRegDetails/groupRegDetails.component";
import { SeasonalPlanDetailsComponent } from "./rehabilitationProgram/seasonalPlanDetails/seasonalPlanDetails.component";
import { MonthPlanDetailsComponent } from "./rehabilitationProgram/monthPlanDetails/monthPlanDetails.component";
import { WeekPlanDetailsComponent } from "./rehabilitationProgram/weekPlanDetails/weekPlanDetails.component";
import { BrainsDetailsComponent } from "./childRehabilition/brainsDetails/brainsDetails.component";
import { LimeDetailsComponent } from "./childRehabilition/limeDetails/limeDetails.component";
const routes: Routes = [
  // 康复登记
  {
    path: "rehabilitationRegistration",
    component: RehabilitationRegistrationComponent
  },
  // 康复登记添加
  {
    path: "rehabilitationRegistration/rehabilitationRegistrationAdd",
    component: RehabilitationRegistrationAddComponent
  },
  // 康复登记查看
  {
    path: "rehabilitationRegistration/rehabilitationRegistrationCheck",
    component: RehabilitationRegistrationCheckComponent
  },
  {
    path: "rehabilitationPerson",
    component: RehabilitationPersonComponent
  },
  // 康复个案添加
  {
    path: "rehabilitationPerson/rehabilitationPersonAdd",
    component: RehabilitationPersonAddComponent
  },
  // 康复个案查看
  {
    path: "rehabilitationPerson/rehabilitationPersonCheck",
    component: RehabilitationPersonCheckComponent
  },
  {
    path: "rehabilitationPersonInitial",
    component: RehabilitationPersonInitialComponent
  },
  {
    path: "rehabilitationPersonMiddle",
    component: RehabilitationPersonMiddleComponent
  },
  {
    path: "rehabilitationPersonMiddle/PersonMiddleAdd",
    component: PersonMiddleAddComponent
  },
  {
    path: "rehabilitationPersonMiddle/PersonMiddleCheck",
    component: PersonMiddleCheckComponent
  },
  {
    path: "rehabilitationPersonFinal",
    component: RehabilitationPersonFinalComponent
  },
  {
    path: "rehabilitationGroup",
    component: RehabilitationGroupComponent
  },
  {
    path: "rehabilitationGroup/GroupAdd",
    component: GroupAddComponent
  },
  {
    path: "rehabilitationGroup/GroupCheck",
    component: GroupCheckComponent
  },
  {
    path: "childRehabilitation", //儿童康复
    component: ChildRehabilitionComponent
  },
  {
    path: "childRehabilitation/brainsDetails", //儿童康复中智力残疾档案详情
    component: BrainsDetailsComponent
  },
  {
    path: "childRehabilitation/limeDetails", //儿童康复中肢体障碍档案详情
    component: LimeDetailsComponent
  },
  {
    path: "rehFiles", //康复档案
    component: RehabilitationFilesComponent
  },
  {
    path: "rehabilitationTeam", //康复小组
    component: RehabilitionTeamComponent
  },
  {
    path: "rehProgram", //康复计划
    component: RehabilitationProgramComponent
  },
  {
    path: "rehProgram/seasonalPlanDetails", //康复计划季度计划
    component: SeasonalPlanDetailsComponent
  },
  {
    path: "rehProgram/monthPlanDetails", //康复计划月度计划
    component: MonthPlanDetailsComponent
  },
  {
    path: "rehProgram/weekPlanDetails", //康复计划周计划
    component: WeekPlanDetailsComponent
  },
  {
    path: "regTraining", //训练登记
    component: RegistrationTrainingComponent
  },
  {
    path: "regTraining/trainingRe", //个训训练登记记录列表
    component: ATrainingReComponent
  },
  {
    path: "regTraining/trainingReDetails", //个训训练登记记录详情
    component: ATrainingReDetailsComponent
  },
  {
    path: "rehabConfiguration", //康复配置列表
    component: RehabilitionConfigurationComponent
  },

  {
    path: "regTraining/groupRegList", //小组训练登记记录列表
    component: GroupRegListComponent
  },
  {
    path: "regTraining/groupReDetails", //小组训练登记记录详情
    component: GroupRegDetailsComponent
  },
  {
    path: "rehabConfiguration", //康复配置列表
    component: RehabilitionConfigurationComponent
  },
  {
    path: "rehabConfiguration/dictionaryData", //康复配置数据列表
    component: DictionaryDataComponent
  },
  {
    path: "rehabConfiguration/dictionaryData/addDictionaryData", //康复配置数据添加
    component: AddDictionaryDataComponent
  },
  {
    path: "printFiles", //打印康复档案
    component: PrintFilesComponent
  }
  // {
  //   path: 'rehabConfiguration/dictionaryData/addDictionaryData',
  //   component: AddDictionaryDataComponent
  // },
  // {
  //   path: 'rehabConfiguration/addDigitalDictionary',
  //   component: AddDigitalDictionaryComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RehabilitationRoutingModule {}
