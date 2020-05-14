import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AdmissionRegistrationRoutingModule } from "./admission-registration-manager-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { AdmissionRegistrationManagerComponent } from "./list/admission-registration-manager.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AdmissionRegistrationRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    AdmissionRegistrationManagerComponent,
    AddComponent,
    CheckComponent
  ]
})
export class AdmissionRegistrationManagerModule {}
