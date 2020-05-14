import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgModule } from "@angular/core";
import { HttpModule } from "@angular/http";

import { OrganizationalManageComponent } from "./organizationalManage.component";
import { OrganizationalManageRoutingModule } from "./organizationalManage-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { MirrortechCommonModule } from "../../common/common.module";
import { PrincipalInfoComponent } from "./principalInfo/principalInfo.component";
import { FacilityInfoComponent } from "./facilityInfo/facilityInfo.component";
import { BuildingInfoComponent } from "./buildingInfo/buildingInfo.component";
import { PeopleInfoComponent } from "./peopleInfo/peopleInfo.component";
import { RatesInfoInfoComponent } from "./ratesInfo/ratesInfo.component";
import { ServiceInfoComponent } from "./serviceInfo/serviceInfo.component";
import { OtherInfoComponent } from "./otherInfo/otherInfo.component";
import { MaterialInfoComponent } from "./materialInfo/materialInfo.component";
import { ConfigInfoComponent } from "./configInfo/configInfo.component";
import { BasicInfoComponent } from "./basicInfo/basicInfo.component";

@NgModule({
  imports: [
    NgbModule,
    OrganizationalManageRoutingModule,
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    OrganizationalManageComponent,
    BasicInfoComponent,
    PrincipalInfoComponent,
    FacilityInfoComponent,
    BuildingInfoComponent,
    PeopleInfoComponent,
    RatesInfoInfoComponent,
    ServiceInfoComponent,
    OtherInfoComponent,
    MaterialInfoComponent,
    ConfigInfoComponent
  ]
})
export class OrganizationalManageModule {}
