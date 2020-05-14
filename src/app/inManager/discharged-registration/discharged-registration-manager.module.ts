import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DischargedRegistrationRoutingModule } from "./discharged-registration-manager-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgZorroAntdModule } from "ng-zorro-antd";
import { DischargedRegistrationManagerComponent } from "./list/discharged-registration-manager.component";
import { AddComponent } from "./add/add.component";
import { CheckComponent } from "./check/check.component";
import { LookComponent } from "./look/look.component";
import { MirrortechCommonModule } from "../../common/common.module";

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    DischargedRegistrationRoutingModule,
    NgZorroAntdModule,
    MirrortechCommonModule
  ],
  providers: [],
  declarations: [
    DischargedRegistrationManagerComponent,
    AddComponent,
    CheckComponent,
    LookComponent
  ]
})
export class DischargedRegistrationManagerModule {}
