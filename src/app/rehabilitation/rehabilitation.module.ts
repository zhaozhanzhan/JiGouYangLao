import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RehabilitationRoutingModule } from "./rehabilitation-routing.module";
import { MirrortechCommonModule } from "../common/common.module";
import { NgZorroAntdModule } from "ng-zorro-antd";
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
import { ATrainingComponent } from "./registrationTraining/aTraining/aTraining.component";
import { GroupRegComponent } from "./registrationTraining/groupReg/groupReg.component";
import { ATrainingReComponent } from "./registrationTraining/aTrainingRe/aTrainingRe.component";
import { GroupRegListComponent } from "./registrationTraining/groupRegList/groupRegList.component";
import { GroupRegDetailsComponent } from "./registrationTraining/groupRegDetails/groupRegDetails.component";
import { ATrainingReDetailsComponent } from "./registrationTraining/aTrainingReDetails/aTrainingReDetails.component";
import { SeasonalPlanDetailsComponent } from "./rehabilitationProgram/seasonalPlanDetails/seasonalPlanDetails.component";
import { MonthPlanDetailsComponent } from "./rehabilitationProgram/monthPlanDetails/monthPlanDetails.component";
import { WeekPlanDetailsComponent } from "./rehabilitationProgram/weekPlanDetails/weekPlanDetails.component";
import { BrainsDetailsComponent } from "./childRehabilition/brainsDetails/brainsDetails.component";
import { BrainsOverviewComponent } from "./childRehabilition/brainsOverview/brainsOverview.component";
import { IntelligencePlanComponent } from "./childRehabilition/intelligencePlan/intelligencePlan.component";
import { LimeDetailsComponent } from "./childRehabilition/limeDetails/limeDetails.component";
import { LimePlanComponent } from "./childRehabilition/limePlan/limePlan.component";
import { ENgxPrintModule } from "e-ngx-print";

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RehabilitationRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule,
    ENgxPrintModule
  ],
  providers: [],
  declarations: [
    RehabilitationRegistrationComponent,
    RehabilitationRegistrationAddComponent,
    RehabilitationRegistrationCheckComponent,
    RehabilitationPersonComponent,
    RehabilitationPersonAddComponent,
    RehabilitationPersonCheckComponent,
    RehabilitationPersonInitialComponent,
    RehabilitationPersonMiddleComponent,
    PersonMiddleAddComponent,
    PersonMiddleCheckComponent,
    RehabilitationPersonFinalComponent,
    RehabilitationGroupComponent,
    GroupAddComponent,
    GroupCheckComponent,
    ChildRehabilitionComponent,
    RehabilitionTeamComponent,
    RehabilitionConfigurationComponent,
    DictionaryDataComponent,
    AddDictionaryDataComponent,
    RehabilitationFilesComponent,
    RehabilitationProgramComponent,
    RegistrationTrainingComponent,
    PrintFilesComponent,
    GroupRegComponent,
    ATrainingComponent,
    ATrainingReComponent,
    GroupRegListComponent,
    GroupRegDetailsComponent,
    ATrainingReDetailsComponent,
    SeasonalPlanDetailsComponent,
    MonthPlanDetailsComponent,
    WeekPlanDetailsComponent,
    BrainsDetailsComponent,
    BrainsOverviewComponent,
    IntelligencePlanComponent,
    LimeDetailsComponent,
    LimePlanComponent
  ],
  entryComponents: [
    RehabilitationRegistrationComponent,
    RehabilitationRegistrationAddComponent,
    RehabilitationRegistrationCheckComponent,
    RehabilitationPersonComponent,
    RehabilitationPersonAddComponent,
    RehabilitationPersonCheckComponent,
    RehabilitationPersonInitialComponent,
    RehabilitationPersonMiddleComponent,
    PersonMiddleAddComponent,
    PersonMiddleCheckComponent,
    RehabilitationPersonFinalComponent,
    RehabilitationGroupComponent,
    GroupAddComponent,
    GroupCheckComponent,
    ChildRehabilitionComponent,
    RehabilitionTeamComponent,
    RehabilitionConfigurationComponent,
    DictionaryDataComponent,
    AddDictionaryDataComponent,
    RehabilitationFilesComponent,
    RehabilitationProgramComponent,
    RegistrationTrainingComponent,
    PrintFilesComponent,
    GroupRegComponent,
    ATrainingComponent,
    ATrainingReComponent,
    GroupRegListComponent,
    GroupRegDetailsComponent,
    ATrainingReDetailsComponent,
    SeasonalPlanDetailsComponent,
    MonthPlanDetailsComponent,
    WeekPlanDetailsComponent,
    BrainsDetailsComponent,
    BrainsOverviewComponent,
    IntelligencePlanComponent,
    LimeDetailsComponent,
    LimePlanComponent
  ]
})
export class RehabilitationModule {}
